from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from schemas import EntryIn, EntryOut, ToDoOut, ToDoIn
from db_models import DBEntries, DBTodos
from datetime import date

DATABASE_URL = "postgresql+psycopg://postgres:postgres@localhost:5432/entries_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(engine)


def get_all_db_entries() -> list[EntryOut] | None:
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


def get_single_db_entry(entry_id: int) -> EntryOut | None:
    with SessionLocal() as db:
        stmt = select(DBEntries).where(DBEntries.entry_id == entry_id)
        db_entry = db.scalar(stmt)
        if db_entry:
            return EntryOut(
                entry_id=db_entry.entry_id,
                post_date=db_entry.post_date,
                title=db_entry.title,
                content=db_entry.content,
            )


def post_single_db_entry(new_entry: EntryIn) -> EntryOut | None:
    with SessionLocal() as db:
        db_entry = DBEntries(post_date=date.today(), **new_entry.model_dump())
        db.add(db_entry)
        db.commit()
        db.refresh(db_entry)
        return EntryOut(
            entry_id=db_entry.entry_id,
            post_date=db_entry.post_date,
            title=db_entry.title,
            content=db_entry.content,
        )


def delete_single_db_entry(entry_id: int):
    with SessionLocal() as db:
        stmt = select(DBEntries).where(DBEntries.entry_id == entry_id)
        entry = db.scalar(stmt)
        if not entry:
            return False
        db.delete(entry)
        db.commit()
    return True


def update_db_entry(entry_id: int, updated_entry: EntryIn) -> EntryOut | None:
    with SessionLocal() as db:
        stmt = select(DBEntries).where(DBEntries.entry_id == entry_id)
        entry = db.scalar(stmt)
        if not entry:
            return None
        for key, value in updated_entry.model_dump().items():
            setattr(entry, key, value)
        db.commit()
        db.refresh(entry)
        return EntryOut(
            entry_id=entry.entry_id,
            post_date=entry.post_date,
            title=entry.title,
            content=entry.content,
        )


# -----------------------------------------------
# todos


def get_db_todos(entry_id: int):
    todo_list = []
    with SessionLocal() as db:
        stmt = select(DBTodos).where(DBTodos.entry_id == entry_id)
        db_todos = db.scalars(stmt).all()
        if db_todos:
            for db_todo in db_todos:
                todo_list.append(
                    ToDoOut(
                        to_do_id=db_todo.to_do_id,
                        entry_id=db_todo.entry_id,
                        task=db_todo.task,
                        is_completed=db_todo.is_completed,
                    )
                )
            return todo_list
        else:
            return None


def add_db_todo():
    return None


def delete_db_todo():
    return None


def update_db_todo():
    return None


def mark_db_todo_completed():
    return None


# get all todos for particular entry

# add todo

# delete todo

# update todo

# mark completed todo
