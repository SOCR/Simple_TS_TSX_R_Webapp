from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os

DATA_DIR = "../data/"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    print(f"Received file: {file.filename}, size: {file.size} bytes")
    file_location = os.path.join(DATA_DIR, file.filename)

    # TODO handle already existing file
    with open(file_location, "wb") as f:
        content = await file.read() 
        f.write(content)

    return {"message": "File uploaded successfully", "file_name": file.filename}



@app.get("/files")
async def list_files():
    print("Listing files in data directory")
    files = os.listdir(DATA_DIR)
    return {"files": files}

@app.get("/files/{file_name}")
async def get_file(file_name: str):
    print(f"Getting file: {file_name}")
    file_location = os.path.join(DATA_DIR, file_name)
    if not os.path.exists(file_location):
        return {"error": "File not found"}
    
    with open(file_location, "rb") as f:
        content = f.read()

    return {"file_name": file_name, "content": content}