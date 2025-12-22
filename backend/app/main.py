import base64
from dotenv import load_dotenv
import os
from requests import post

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.year import router as year_router
from app.api.v1.movies import router as movies_router
from app.api.v1.music import router as music_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(year_router, prefix="/api/v1")
app.include_router(movies_router, prefix="/api/v1")
app.include_router(music_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {
        "message": "WikiCap API is running!",
    }

spotify_client_id = os.getenv("SPOTIFY_CLIENT_ID")
spotify_client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")

def get_spotify_token():
    auth_string = spotify_client_id + ":" + spotify_client_secret
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"

    }
    data = {"grant_type": "client_credentials"}
    result = post(url, headers=headers, data=data)
    json_result = result.json()
    token = json_result["access_token"]
    return token

spotify_token = get_spotify_token()
print("Spotify token: ", spotify_token)