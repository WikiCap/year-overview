from dotenv import load_dotenv
import os
load_dotenv()

from fastapi import FastAPI


app = FastAPI()

@app.get("/")
def read_root():
    return {
        "message": "WikiCap API is running!",
    }