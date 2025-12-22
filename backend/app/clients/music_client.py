import json
from app.core import config
import httpx
from requests import get

BASE_URL = "https://billboard-api2.p.rapidapi.com"
SPOTIFY_BASE_URL = "https://api.spotify.com/v1/search"

def get_top_artists_by_year(year: int): #  Ska tas bort sen
    response = httpx.get(
        f"{BASE_URL}/year-end-chart/top-artists",
        headers={
            "Accept": "application/json",
            'x-rapidapi-key': config.BILLBOARD_100_API_KEY,
            'x-rapidapi-host': "billboard-api2.p.rapidapi.com"
        },
        params={
            "year": year
        }
    )
    
    return response.json()


def get_songs_by_year(year: int, token):
    headers = token
    query = f"?q={year}&type=artist&limit=10"  #Limit = 1, så endast en artist returneras
    query_url = SPOTIFY_BASE_URL + query

    result = get(query_url, headers=headers)
    json_result = json.loads(result.content)["artists"]["items"]
    if(len(json_result) == 0):                  # Om ingen artist hittas
        print("No artist found for the year:", year)
        return None
    
    return json_result[0]  # Returna första resultatet
    