from schemas import EntryIn, EntryOut, ToDoOut, ToDoIn
from fastapi import FastAPI, HTTPException
from db import (
    get_all_db_entries,
    get_single_db_entry,
    post_single_db_entry,
    delete_single_db_entry,
    update_db_entry,
    get_db_todos,
    add_db_todo,
    delete_db_todo,
    update_db_todo,
    mark_db_todo_completed,
)

# from db import ???

# --------------------------------
# entry endpoints


app = FastAPI()


@app.get("/entries")
async def get_all_entries():
    return get_all_db_entries()


@app.get("/entries/{entry_id}")
async def get_single_entry(entry_id: int):
    entry = get_single_db_entry(entry_id=entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry


@app.post("/entries")
async def post_entry(new_entry: EntryIn):
    return post_single_db_entry(new_entry)


@app.delete("/entries/{entry_id}")
async def delete_entry(entry_id: int):
    validCheck = delete_single_db_entry(entry_id)
    if validCheck is True:
        return validCheck
    elif validCheck is False:
        raise HTTPException(status_code=404, detail="Entry not found")


@app.put("/entries/{entry_id}")
async def update_entry(entry_id: int, updated_entry: EntryIn):
    confirmUpdate = update_db_entry(entry_id, updated_entry)
    if confirmUpdate:
        return confirmUpdate
    else:
        raise HTTPException(status_code=404, detail="Entry not found")
    


# ---------------------------------------
# todo endpoints


@app.get("/entries/{entry_id}/todos")
async def get_todos_for_entry():
    return None


@app.post("/entries/{entry_id}/todos")
async def post_todo():
    return None


@app.delete("/entries/{entry_id}/todos")
async def delete_todo():
    return None


@app.patch("/entries/{entry_id}/todos")
async def update_todo():
    return None


@app.patch("/entries/{entry_id}/todos/completed")
async def mark_todo_completed():
    return None
