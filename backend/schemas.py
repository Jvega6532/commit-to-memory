from pydantic import BaseModel
from datetime import date


class EntryIn(BaseModel):
    proj_link: str
    title: str
    content: str


class EntryOut(EntryIn):
    post_date: date
    entry_id: int


class ToDoIn(BaseModel):
    task: str


class ToDoOut(ToDoIn):
    todo_id: int
    completion: bool
    entry_id: int
