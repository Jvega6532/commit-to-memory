from pydantic import BaseModel
from datetime import date


class EntryIn(BaseModel):
    title: str
    content: str


class EntryOut(EntryIn):
    post_date: date
    entry_id: int


class ToDoIn(BaseModel):
    task: str


class ToDoOut(ToDoIn):
    to_do_id: int
    is_completed: bool
    entry_id: int
