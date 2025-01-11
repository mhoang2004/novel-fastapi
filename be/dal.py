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


async def get_users():
    users = []
    async for user in user_collection.find():
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


async def get_books(is_valid=True, limit=20, title=None, genre=None, author=None):
    query = {"is_valid": is_valid}

    # Add title filter
    if title:
        query["title"] = {"$regex": title, "$options": "i"}

    # Add genre filter
    if genre:
        query["genres"] = {"$in": [genre]}

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
        result.append({
            "_id": str(book["_id"]),
            "title": book.get("title", ""),
            "cover": book.get("cover", ""),
        })

    return result


async def get_user(**kargs):
    user = await user_collection.find_one(kargs)
    if user:
        user["_id"] = str(user["_id"])
        return user

    return None


async def create_user(user, hashed_password):
    # Create a new user document
    new_user = {
        "username": user.username,
        "email": user.email,
        "hashed_password": hashed_password,
        "avt": "./default-avt.jpg",
        "name": None,
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
                genre_names.append(genre["name"])

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
    res = db["fs.chunks"].delete_many({"files_id": book["cover"]})
    print(res)

    book_collection.delete_one({"_id": ObjectId(book_id)})
    chapters_deleted = chapter_collection.delete_many(
        {"novel_id": ObjectId(book_id)})

    return str(chapters_deleted)