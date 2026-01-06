from bs4 import BeautifulSoup 
import httpx
from dotenv import load_dotenv
import os
from pathlib import Path


HEADERS = {
    "User-Agent": "WikiCap/1.0 (https://github.com/WikiCap/year-overview)"
}

def get_billboard_artist(year: int) ->list[str]:
    
    if year >=2000:
        url = (f"https://en.wikipedia.org/wiki/"
               f"List_of_Billboard_Hot_100_number-one_of_{year}"
        )
        table_class = "wikitable plainrowheaders top 3"
    else: 
        url = ( f"https://en.wikipedia.org/wiki/"
                f"List_of_Billboard_Hot_100_number-one_singles_of_{year}"
        )
        table_class = "wikitable plainrowheaders"
    
    response = httpx.get(url, headers=HEADERS)
    if response.status_code != 200:
        return None, None
    
    return response, table_class
    
URL = "https://ws.audioscrobbler.com/2.0/"
LASTFM_API_KEY = os.getenv("LASTFM_API_KEY")


def get_artist_lastfm(artist_name: str, limit: int=5) ->list[dict]:
    """
    Search for artist by name using Last.fm API. 
    
    Function calls Last.fm's "artist.search" endpoint and returns a list of mathcing artist names.
    If the request fails, times out or data is missing, an empty list is returned.
    
        Args: 
            artist_name(str): The name of the artist to search for.
            limit (int): Maximum number of artrists to return. Defaults at 5.

        Returns: 
            list[dict]: A list of artist names. Returns an empty list if no artist is found.  
    """
    
    params = {
        "method": "artist.search",
        "artist": artist_name,
        "api_key": LASTFM_API_KEY,
        "format": "json",
        "limit": limit,
    }
    
    try: 
        response = httpx.get(URL, params=params, timeout=15)
    except httpx.ReadTimeout:
        return []
    
    if response.status_code != 200:
        return []
    
    api_data = response.json()
    
    results = api_data.get("results")
    if results is None:
        return []
    
    artistmatches = results.get("artistmatches") 
    if artistmatches is None:  
        return []
    
    artists = artistmatches.get("artist")
    if artists is None: 
        return []
    
    artist_list = []
    
    for artist in artists:
        name = artist.get("name")
        if name is not None:
            artist_list.append(name)
            
    return artist_list        


def get_hit_song(artist: str, limit: int=5) -> list[dict]:
    """
    Retrive an artist's hit songs from the Last.fm API. 
    
    Uses the "artist.gettoptracks" endpoint to fetch a list of the artists most popluar songs.
    If the request fails, times out or data is missing, an empty list is returned.
    
    Args:
        artist (str): The name of the artist.
        limit (int): Maximum number of songss to return. Defaults at 5.
        
    :Returns: 
        list[dict]: A list of dictionaries containing song titles. 
        Returns an empty list if no songs are found.    
    """
    
    
    params = {
        "method": "artist.gettoptracks",
        "artist": artist,
        "api_key": LASTFM_API_KEY,
        "format": "json",
        "limit": limit,
        "autocorrect": 1,
    }
        
    try:
        response = httpx.get(URL, params=params, timeout=15)
    except httpx.ReadTimeout:
        return []
    
    print("STATUS:", response.status_code)
    print("URL:", response.url)
    print("RAW RESPONSE:", response.text[:500])
        
    if response.status_code != 200:
        return []
        
    data = response.json()
        
    toptracks = data.get("toptracks")
    if not toptracks:
        return []
            
    tracks = toptracks.get("track")
    if not tracks:
        return []
    
    if isinstance(tracks, dict):
        tracks = [tracks]
        
    return [
        {"title": track.get("name")}
        for track in tracks
        if track.get("name")
    ]  
    