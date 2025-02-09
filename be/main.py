
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import models
import dal
import auth

app = FastAPI()
load_dotenv()

origins = [
    "http://localhost:5173",
    os.getenv("FRONTEND")
]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/books")
async def get_books(sort: str | None = None, title: str | None = None, author: str | None = None, genre: str | None = None,):
    books = await dal.get_books(sort_by=sort, title=title, author=author, genre=genre)
    return books


@app.post("/ratings")
async def add_rating(input: models.RatingInput, access_token: str = Depends(oauth2_scheme)):
    user = await auth.decode_token(access_token)

    try:
        res = await dal.add_rating(input.book_id, user["_id"], input.star)
        if res:
            return {"message": "Thank for your rating", "rating_id": res}
        return {"message": "You have already rated"}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/comments")
async def add_comment(input: models.CommentInput, access_token: str = Depends(oauth2_scheme)):
    user = await auth.decode_token(access_token)

    try:
        res = await dal.add_comment(input.book_id, user["_id"], input.comment)
        return {"message": "Success", "comment_id": res}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/comments/{book_id}")
async def get_comment(book_id: str):
    comments = await dal.get_comment(book_id)
    return comments


@app.get("/comments")
async def get_comments(access_token: str = Depends(oauth2_scheme)):
    user = await auth.decode_token(access_token)

    if user and user["is_admin"]:
        comments = await dal.get_comments()
        return comments
    raise HTTPException(
        status_code=403, detail="You don't have the permission")


@app.get("/ratings/{book_id}")
async def get_rating(book_id: str):
    ratings = await dal.get_rating(book_id)
    return ratings


@app.get("/pending_books")
async def get_pending_books(access_token: str = Depends(oauth2_scheme)):
    books = await dal.get_books(is_valid=False, is_approved=False)
    user = await auth.decode_token(access_token)

    novels = []
    if user and user["is_admin"]:
        for book in books:
            novel = await dal.get_book(book["_id"], is_valid=False)
            novels.append(novel)
    return novels


@app.post("/active-book")
async def active_book(request: models.PendingBookRequest, access_token: str = Depends(oauth2_scheme)):
    user = await auth.decode_token(access_token)

    if user and user["is_admin"]:
        await dal.active_book(request.book_id)
        return {"message": "Book upload successfully!!!"}
    raise HTTPException(
        status_code=403, detail="You don't have the permission")


@app.post("/reject-book")
async def reject_book(request: models.PendingBookRequest, access_token: str = Depends(oauth2_scheme)):
    user = await auth.decode_token(access_token)

    if user and user["is_admin"]:
        await dal.reject_book(request.book_id)
        return {"message": "Reject successfully!!!"}
    raise HTTPException(
        status_code=403, detail="You don't have the permission")


@app.get("/author-books")
async def get_author_books(access_token: str = Depends(oauth2_scheme)):
    user = await auth.decode_token(access_token)
    books = await dal.get_books(author=user["_id"])
    return books


@app.get("/history")
async def get_history(access_token: str = Depends(oauth2_scheme)):
    user = await auth.decode_token(access_token)
    books = await dal.get_history(author=user["_id"])
    return books


@app.get("/genres")
async def get_genres():
    genres = await dal.get_genres()
    return genres


@app.get("/books/{book_id}")
async def get_book(book_id: str):
    book = await dal.get_book(book_id)
    return book


@app.get("/books/{book_id}/chapters/{chapter_num}")
async def get_chapter(book_id: str, chapter_num: int):
    data = await dal.get_chapter(book_id, chapter_num)
    book = await dal.get_reading_book(book_id)
    data["book"] = book
    return data


@app.get("/user-info")
async def get_user_info(access_token: str = Depends(oauth2_scheme)):
    user = await auth.decode_token(access_token)
    return user


@app.post("/login", response_model=models.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    await auth.authenticate_user(form_data.username, form_data.password)
    access_token = auth.create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_id = await dal.upload_image(file)
    return JSONResponse(content={"fileId": file_id})


@app.post("/signup", status_code=201)
async def signup(user: models.User):

    # Check for existing user by email
    existing_user_by_email = await dal.get_user(email=user.email)
    if existing_user_by_email:
        raise HTTPException(status_code=400, detail="Email already exists.")

    # Check for existing user by username
    existing_user = await dal.get_user(username=user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists.")

    hashed_password = auth.hash_password(user.password)
    await dal.create_user(user, hashed_password)

    access_token = auth.create_access_token(
        data={"sub": user.username})

    return {"access_token": access_token}


@app.get("/image/{file_id}")
async def get_image(file_id: str):
    return await dal.get_image(file_id)


@app.post("/novels")
async def store_temp_novel(book: models.Book, access_token: str = Depends(oauth2_scheme)):
    user = await auth.decode_token(access_token)

    try:
        inserted_id = await dal.store_temp_novel(book, user["_id"])

        return {"message": "Book sent successfully", "novel_id": inserted_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chapter")
async def store_chapter(chapter: models.ChapterInsert, access_token: str = Depends(oauth2_scheme)):
    user = await auth.decode_token(access_token)

    try:
        inserted_id = await dal.store_chapter(chapter, user["_id"])
        if not inserted_id:
            raise HTTPException(
                status_code=403, detail="The book is not yours")

        return {"message": "Book stored successfully", "chapter_id": inserted_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/novel/{book_id}")
async def delete_novel_and_chapters(book_id: str, access_token: str = Depends(oauth2_scheme)):
    user = await auth.decode_token(access_token)

    if user and user["is_admin"]:
        chapters_deleted = await dal.delete_novel_and_chapters(book_id)
        return {
            "message": "Book and associated chapters deleted successfully",
            "chapters_deleted_count": chapters_deleted
        }
    raise HTTPException(
        status_code=403, detail="You don't have the permission")


@app.get("/get-users")
async def get_users(access_token: str = Depends(oauth2_scheme)):
    user = await auth.decode_token(access_token)

    if user and user["is_admin"]:
        users = await dal.get_users()
        return users
    raise HTTPException(
        status_code=403, detail="You don't have the permission")


@app.post("/update-pen-name")
async def update_user_name(req: models.NameInput, access_token: str = Depends(oauth2_scheme)):
    user = await auth.decode_token(access_token)

    if user:
        await dal.update_user_name(user["_id"], req.name)
        return {"message": "Successfully!!!"}
    raise HTTPException(
        status_code=403, detail="You don't have the permission")


@app.get("/genre-stats")
async def get_genre_stats():
    return await dal.get_genre_stats()


@app.get("/novel-stats")
async def get_novel_stats():
    formatted_stats = await dal.get_novel_stats()

    return JSONResponse(content=formatted_stats)


@app.post("/toggle-user-active")
async def toggle_user_active(req: models.UserInput, access_token: str = Depends(oauth2_scheme)):
    user = await auth.decode_token(access_token)
    if user and user["is_admin"]:
        await dal.toggle_user_active(req.user_id)


@app.post("/delete-comment")
async def delete_comment(req: models.CommentDeleteInput, access_token: str = Depends(oauth2_scheme)):
    user = await auth.decode_token(access_token)
    if user and user["is_admin"]:
        await dal.delete_comment(req.comment_id)
