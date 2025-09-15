from schemas import EntryIn, EntryOut, ToDoOut, ToDoIn
from fastapi import FastAPI, HTTPException
from db import get_all_entries

# from db import ???

# --------------------------------
# entry endpoints


app = FastAPI()


@app.get("/entries")
async def get_all_db_entries():
    return get_all_entries()


@app.get("/entries/{entry_id}")
async def get_single_db_entry():
    return None


@app.post("/entries")
async def post_db_entry():
    return None


@app.delete("/entries/{entry_id}")
async def delete_db_entry():
    return None


@app.patch("/entries/{entry_id}")
async def update_db_entry():
    return None


# ---------------------------------------
# todo endpoints


@app.get("/todos/{entry_id}")
async def get_db_todos_for_entry():
    return None


@app.post("/todos/{entry_id}")
async def post_db_todo():
    return None


@app.delete("/todos/{entry_id}")
async def delete_db_todo():
    return None


@app.patch("/todos/{entry_id}")
async def update_db_todo():
    return None


@app.patch("/todos/{entry_id}/completed")
async def mark_todo_completed():
    return None
