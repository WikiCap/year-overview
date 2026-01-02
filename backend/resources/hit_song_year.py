from dotenv import load_dotenv
import httpx 
import os
from backend.resources.artist_of_the_year import get_artist_of_the_year
from pathlib import Path

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(env_path)

URL = "https://ws.audioscrobbler.com/2.0/"
LASTFM_API_KEY = os.getenv("LASTFM_API_KEY")


def get_artist(artist_name: str, limit: int=5) ->list[dict]:
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

          
def get_year_with_hit_songs(year: int, limit: int = 5) -> dict:
    """
    Combines artists of a given year with their hit songs. 
    
    Retrives artist for the specified year using get_artrist_of_the_year function.
    Then feches each artist's top hit songs using get_hit_song function. 
    
    Args:
        year (int): The year for which artists and songs to be retrieved.
        limit (int): Maximum number of top songs to return for each artist. Defaults at 5.
    
    :Returns: 
        dict: A dictionary containing the year, artist names and their top songs.
    """   
   
    artists = get_artist_of_the_year(year)
    
    result = {
        "year": year,
        "artist": []
    }  
    
    for artist in artists: 
        top_songs = get_hit_song(artist, limit)    
        
        if not top_songs: 
            continue  
        
        result["artist"].append({
            "artist": artist, 
            "toptracks": top_songs
        })


    return result   

   