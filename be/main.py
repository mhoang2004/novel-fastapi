from models import Token, User, Book, PendingBookRequest, ChapterInsert, RatingInput


from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import dal
import auth

app = FastAPI()


origins = [
    "http://localhost:5173",
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
async def get_books(sort: str | None = None):
    print(sort)
    books = await dal.get_books(sort_by=sort)
    return books


@app.post("/ratings")
async def add_rating(input: RatingInput, access_token: str = Depends(oauth2_scheme)):
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


@app.get("/pending_books")
async def get_pending_books(access_token: str = Depends(oauth2_scheme)):
    books = await dal.get_books(is_valid=False)
    user = await auth.decode_token(access_token)

    novels = []
    if user and user["is_admin"]:
        for book in books:
            novel = await dal.get_book(book["_id"])
            novels.append(novel)
    return novels


@app.post("/pending_book")
async def post_pending_book(request: PendingBookRequest, access_token: str = Depends(oauth2_scheme)):
    user = await auth.decode_token(access_token)

    if user and user["is_admin"]:
        await dal.active_book(request.book_id)
        return {"message": "Book upload successfully!!!"}
    raise HTTPException(
        status_code=403, detail="You don't have the permission")


@app.get("/author-books")
async def get_author_books(access_token: str = Depends(oauth2_scheme)):
    user = await auth.decode_token(access_token)
    books = await dal.get_books(author=user["_id"])
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


@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    await auth.authenticate_user(form_data.username, form_data.password)
    access_token = auth.create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_id = await dal.upload_image(file)
    return JSONResponse(content={"fileId": file_id})


@app.post("/signup", status_code=201)
async def signup(user: User):

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
async def store_temp_novel(book: Book, access_token: str = Depends(oauth2_scheme)):
    user = await auth.decode_token(access_token)

    try:
        inserted_id = await dal.store_temp_novel(book, user["_id"])

        return {"message": "Book stored successfully", "novel_id": inserted_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chapter")
async def store_chapter(chapter: ChapterInsert, access_token: str = Depends(oauth2_scheme)):
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
