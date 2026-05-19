# ./cloud-functions/api/python/test.py
from fastapi import FastAPI

app = FastAPI()


@app.get("/items")
async def list_items():
    return {"items": [{"id": 1, "name": "Item A"}, {"id": 2, "name": "Item B"}]}


@app.get("/items/{item_id}")
async def get_item(item_id: int):
    return {"item_id": item_id, "name": f"Item {item_id}"}


@app.post("/items")
async def create_item(item: dict):
    return {"message": "Item created", "item": item}
