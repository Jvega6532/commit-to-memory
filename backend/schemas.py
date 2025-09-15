from pydantic import BaseModel
from datetime import date

class NewEntryIn(BaseModel):
    title: str
    content: str

class NewEntryOut(NewEntryIn):
    date: date
    entry_id: int

class NewToDoIn(BaseModel):
    entry_id: int
    task: str

class newToDoOut(NewToDoIn):
    to_do_id: int
    is_completed: bool
