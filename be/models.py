from pydantic import BaseModel, Field
from typing import List


class Token(BaseModel):
    access_token: str


class User(BaseModel):
    username: str
    email: str
    password: str
    name: str = ''
    avt: str = '/default-avt.jpg'


class Chapter(BaseModel):
    chapterName: str
    content: str
    price: float = 0


class Book(BaseModel):
    bookName: str
    genres: List[str]
    description: str
    bookCover: str
    numberOfChapters: int = Field(..., gt=0)
    chapters: List[Chapter]


class PendingBookRequest(BaseModel):
    book_id: str


class UserInput(BaseModel):
    user_id: str


class ChapterInsert(Chapter):
    novelId: str
    chapterNumber: int
    chapterName: str
    content: str
    price: float = 0


class RatingInput(BaseModel):
    book_id: str
    star: int


class CommentInput(BaseModel):
    book_id: str
    comment: str


class NameInput(BaseModel):
    name: str
