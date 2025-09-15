from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from schemas import EntryIn, EntryOut, ToDoOut, ToDoIn
from db_models import DBEntries, DBTodos

DATABASE_URL = "postgresql+psycopg://postgres:postgres@localhost:5432/entries_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(engine)


def get_all_entries() -> list[EntryOut] | None:
    with SessionLocal() as db:
        db_list_entries = []
        stmt = select(DBEntries)
        db_entries = db.scalars(stmt).all()
        for db_entry in db_entries:
            db_list_entries.append(
                EntryOut(
                    entry_id=db_entry.entry_id,
                    post_date=db_entry.post_date,
                    title=db_entry.title,
                    content=db_entry.content,
                )
            )
    return db_list_entries


def get_single_entry():
    return None


def post_single_entry():
    return None


def delete_single_entry():
    return None


def update_entry():
    return None


# -----------------------------------------------
# todos


def get_todos():
    return None


def add_todo():
    return None


def delete_todo():
    return None


def update_todo():
    return None


def mark_completed():
    return None


# get all todos for particular entry

# add todo

# delete todo

# update todo

# mark completed todo
