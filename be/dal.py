# data access layer

import os
import io

from datetime import datetime

from fastapi import File, UploadFile
from fastapi.responses import StreamingResponse

from bson.objectid import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket

from dotenv import load_dotenv
load_dotenv()

# Connect to MongoDB
MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = "novel"

client = AsyncIOMotorClient(MONGODB_URI)
db = client.get_database(DATABASE_NAME)

fs = AsyncIOMotorGridFSBucket(db)

user_collection = db["users"]
book_collection = db["novels"]
genre_collection = db["genres"]
chapter_collection = db["chapters"]
rating_collection = db["ratings"]
comment_collection = db["comments"]


async def get_users():
    users = []
    async for user in user_collection.find({"is_admin": False}):
        user["_id"] = str(user["_id"])
        users.append(user)
    return users


async def get_genres():
    genres = []
    cursor = genre_collection.find()

    async for genre in cursor:
        genre["_id"] = str(genre["_id"])
        genres.append(genre)

    return genres


async def get_chapter(book_id, chapter_num):
    chapter = await chapter_collection.find_one({
        "novel_id": ObjectId(book_id),
        "chapter_number": chapter_num
    })

    if chapter:
        chapter["_id"] = str(chapter["_id"])
        chapter["novel_id"] = str(chapter["novel_id"])

    return chapter


async def get_rating(book_id):
    pipeline = [
        {"$match": {"novel_id": ObjectId(book_id)}},
        {
            "$group": {
                "_id": "$novel_id",
                "average_rating": {"$avg": "$rating"},
                "rating_count": {"$sum": 1}
            }
        }
    ]

    result = await rating_collection.aggregate(pipeline).to_list(length=1)

    if result:
        return {
            "averageRating": result[0]["average_rating"],
            "ratingCount": result[0]["rating_count"]
        }
    else:
        return {"averageRating": 0, "ratingCount": 0}


async def get_comment(book_id: str, limit=10):
    comments_cursor = comment_collection.find(
        {"novel_id": ObjectId(book_id)}
    ).sort("timestamp", -1).limit(limit)

    comments = []
    async for comment in comments_cursor:

        user = await get_user(_id=comment["user_id"])
        comment["user"] = user["name"] if user["name"] else user["username"]

        comment["_id"] = str(comment["_id"])
        comment["novel_id"] = str(comment["novel_id"])
        comment["user_id"] = str(comment["user_id"])
        comments.append(comment)

    return comments


async def get_history(limit=20, author=None):
    query = {}
    if author:
        try:
            # Ensure author is a valid ObjectId
            query["author"] = ObjectId(author)
        except Exception as e:
            raise ValueError(f"Invalid author ID: {author}") from e

    books = book_collection.find(query).limit(limit)

    result = []
    async for book in books:
        result.append({
            "_id": str(book["_id"]),
            "title": book.get("title", ""),
            "is_valid": book["is_valid"],
            "updated_at": book.get("updated_at", ""),
        })

    return result


async def get_books(is_valid=True, limit=20, title=None, genre=None, author=None, sort_by=None):
    query = {"is_valid": is_valid}

    # Add title filter
    if title:
        query["title"] = {"$regex": title, "$options": "i"}

    # Add genre filter
    if genre:
        query["genres"] = {"$in": [ObjectId(genre)]}

    # Add author filter
    if author:
        try:
            # Ensure author is a valid ObjectId
            query["author"] = ObjectId(author)
        except Exception as e:
            raise ValueError(f"Invalid author ID: {author}") from e

    books = book_collection.find(query).limit(limit)

    result = []
    async for book in books:
        book["rating"] = await get_rating(book["_id"])

        result.append({
            "_id": str(book["_id"]),
            "title": book.get("title", ""),
            "cover": book.get("cover", ""),
            "rating": book["rating"],
            "is_valid": book["is_valid"],
            "updated_at": book.get("updated_at", ""),
        })

    # Sort the books based on the sort_by parameter
    if sort_by == "updated_at":
        result.sort(key=lambda x: x["updated_at"], reverse=True)
    else:
        result.sort(key=lambda x: x["rating"]["averageRating"], reverse=True)

    return result


async def get_user(**kargs):
    user = await user_collection.find_one(kargs)
    if user and user["is_active"]:
        user["_id"] = str(user["_id"])
        return user

    return None


async def create_user(user, hashed_password):
    # Create a new user document
    new_user = {
        "username": user.username,
        "email": user.email,
        "hashed_password": hashed_password,
        "avt": user.avt,
        "name": user.name,
        "is_active": True,
        "is_admin": False,
        "is_author": False,
        "create_at": datetime.now()
    }

    result = await user_collection.insert_one(new_user)
    return result


async def active_book(book_id):
    await book_collection.update_one(
        {"_id": ObjectId(book_id)},
        {"$set": {
            "is_valid": True,
            "updated_at": datetime.now()
        }})

    book = await book_collection.find_one({"_id": ObjectId(book_id)})
    await user_collection.update_one(
        {"_id": ObjectId(book["author"])},
        {"$set": {"is_author": True}})


async def get_reading_book(book_id):
    book = await book_collection.find_one({"_id": ObjectId(book_id)})
    if book:
        number_chapter = 0
        async for _ in chapter_collection.find({"novel_id": ObjectId(book_id)}):
            number_chapter += 1

    return {"title": book["title"], "numberChapter": number_chapter}


async def get_book(book_id):
    book = await book_collection.find_one({"_id": ObjectId(book_id)})

    if book:
        # get genres
        genre_names = []
        for genre_id in book["genres"]:
            genre = await genre_collection.find_one({"_id": genre_id})
            if genre:
                genre["_id"] = str(genre["_id"])
                genre_names.append(genre)

        # get author
        author = await user_collection.find_one({"_id": book["author"]})

        # get chapter
        chapters = []
        async for chapter in chapter_collection.find({"novel_id": ObjectId(book_id)}).sort("chapter_number", 1):
            chapters.append({
                "chapter_number": chapter["chapter_number"],
                "content": chapter["content"],
                "title": chapter["title"]
            })

        book["_id"] = str(book["_id"])
        book["rating"] = await get_rating(book["_id"])
        book["author_id"] = str(book["author"])
        book["author"] = author["name"] if author["name"] else author["username"]
        book["genres"] = genre_names
        book["chapters"] = chapters

    return book


async def upload_image(file: UploadFile = File(...)):
    # Create an in-memory byte stream from the uploaded file
    file_stream = io.BytesIO(await file.read())

    # Upload the file to GridFS asynchronously
    file_id = await fs.upload_from_stream(file.filename, file_stream)

    # Return the file's ID for referencing it later
    return str(file_id)


async def get_image(file_id: str):
    # Convert file_id to ObjectId
    file_id = ObjectId(file_id)

    # Open the file from GridFS asynchronously
    file_stream = await fs.open_download_stream(file_id)

    # Return the file as a streaming response (e.g., for images)
    return StreamingResponse(file_stream, media_type="image/jpeg")


async def store_chapter(chapter, user_id):
    book = await book_collection.find_one({"_id": ObjectId(chapter.novelId)})
    if (str(book["author"]) == user_id):

        new_chapter = {
            "novel_id": ObjectId(chapter.novelId),
            "chapter_number": chapter.chapterNumber,
            "title": chapter.chapterName,
            "content": chapter.content,
            "price": chapter.price
        }

        chapter_result = await chapter_collection.insert_one(new_chapter)

        return str(chapter_result)
    return None


async def store_temp_novel(book, user_id):

    novel = {
        "title": book.bookName,
        "author": ObjectId(user_id),
        "genres": [ObjectId(genre) for genre in book.genres],
        "description": book.description,
        "cover": book.bookCover,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "is_valid": False
    }

    novel_result = await book_collection.insert_one(novel)
    novel_id = novel_result.inserted_id

    chapters = []
    for i, chapter in enumerate(book.chapters):
        chapters.append({
            "novel_id": novel_id,
            "chapter_number": i + 1,
            "title": chapter.chapterName,
            "content": chapter.content,
            "price": chapter.price
        })

    await chapter_collection.insert_many(chapters)

    return str(novel_id)


async def delete_novel_and_chapters(book_id: str):
    book = await book_collection.find_one({"_id": ObjectId(book_id)})
    db["fs.files"].delete_one({"_id": book["cover"]})
    db["fs.chunks"].delete_many({"files_id": book["cover"]})

    book_collection.delete_one({"_id": ObjectId(book_id)})
    chapters_deleted = chapter_collection.delete_many(
        {"novel_id": ObjectId(book_id)})

    return str(chapters_deleted)


async def add_rating(book_id: str, user_id: str, star: int):
    try:
        if not (0 <= star <= 5):
            raise ValueError("Rating must be between 0 and 5")

        existing_rating = await rating_collection.find_one({
            "novel_id": ObjectId(book_id),
            "user_id": ObjectId(user_id)
        })

        if existing_rating:
            return None

        rating_doc = {
            "novel_id": ObjectId(book_id),
            "user_id": ObjectId(user_id),
            "rating": star
        }

        result = await rating_collection.insert_one(rating_doc)

        return str(result.inserted_id)
    except Exception as e:
        raise Exception(f"Failed to add rating: {str(e)}")


async def add_comment(book_id: str, user_id: str, comment: str):
    try:
        comment_doc = {
            "novel_id": ObjectId(book_id),
            "user_id": ObjectId(user_id),
            "timestamp": datetime.now(),
            "content": comment
        }

        result = await comment_collection.insert_one(comment_doc)

        return str(result.inserted_id)
    except Exception as e:
        raise Exception(f"Failed to add rating: {str(e)}")


async def update_user_name(user_id: str, name: str):
    user_id_obj = ObjectId(user_id)

    await user_collection.update_one(
        {"_id": user_id_obj},
        {"$set": {"name": name}}
    )


async def get_genre_stats():
    stats = []
    genres = genre_collection.find()

    async for genre in genres:
        count = await book_collection.count_documents(
            {"genres": genre["_id"]})

        stats.append({
            "genre": {
                "id": str(genre["_id"]),
                "name": genre["name"],
                "description": genre["description"],
            },
            "count": count
        })

    return stats


async def get_novel_stats():
    pipeline = [
        {
            "$project": {
                "date": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": "$created_at"
                    }
                }
            }
        },
        {
            "$group": {
                "_id": "$date",
                "count": {"$sum": 1}
            }
        },
        {
            "$sort": {"_id": 1}  # Sort by date in ascending order
        }
    ]

    stats = await book_collection.aggregate(pipeline).to_list(None)
    formatted_stats = [{"date": stat["_id"],
                        "count": stat["count"]} for stat in stats]

    return formatted_stats


async def toggle_user_active(user_id):

    user = await user_collection.find_one({"_id": ObjectId(user_id)})

    if user:
        new_status = not user.get("is_active", False)
        await user_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_active": new_status}}
        )
