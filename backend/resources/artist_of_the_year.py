from bs4 import BeautifulSoup 
import httpx, re
from resources.wiki_service import HEADERS


def get_artist_of_the_year(year: int) ->list[str]:
    """
    Retrives the top Billboard artists for a given year by using Wikipedia API.
    Handles different URL structures for years before and after 2000. 
    
    :Args: year (int): The year for which Billboard hot 100 #1 artists to be retrieved.
    
    :Returns: 
    List[str]: A list of artist names that had #1 hits on Billboard for the specified year.
    If the page or table is not found,it returns an empty list.
    """
    
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
        return []
    
     #Läser in HTML-sida med BeautifulSoup. 
    soup = BeautifulSoup(response.text, "html.parser")
     
    #Letar upp rätt tabell på sidan när Billdoard listar topp 3 artister för året. 
    table = soup.find("table", class_=table_class)
    if not table: 
        return []
    
    list_of_artists = []
    
    rows = table.find_all("tr")[1:] # Hoppar över header-raden.
    for row in rows:
        cells = row.find_all(["th", "td"])
        if len(cells) <= 2:
            continue
        artist_name = cells[1].get_text(strip=True)
        
        #Tar bort eventuella referensmarkeringar i artistnamnet. Ersätter text som matchar ett mönster.
        artist_name = re.sub(r"\[.*?\]", "", artist_name).strip()
        
        if artist_name:
            list_of_artists.append(artist_name)
    
    return list_of_artists  
      