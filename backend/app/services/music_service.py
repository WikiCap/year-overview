from app.clients.music_client import get_top_artists_by_year, get_songs_by_year
import os
import base64
from requests import post

spotify_client_id = os.getenv("SPOTIFY_CLIENT_ID")
spotify_client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")

def get_spotify_token(): # Getter för att få en token från Spotify, den varar i 1 timme
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

def get_auth_header(token):
    spotify_token = token
    return {"Authorization": "Bearer " + spotify_token}

spotify_token = get_spotify_token()


auth_header = get_auth_header(spotify_token)
result = get_songs_by_year(2001, auth_header)
print(result)








def fetch_artists_for_year(year: int): # billboard top artists, använd ej , ska tas bort
    raw = get_top_artists_by_year(year)

    artists = []

    for item in list(raw.get("content", {}).values())[:10]:
        artists.append({
            "rank": item["rank"],
            "artist": item["artist"],
            "image": item["image"]
        })

    return {
        "year": year,
        "topArtists": artists,
        "source": "RapidAPI Billboard"
    }
