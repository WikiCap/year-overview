import re
from bs4 import BeautifulSoup
from app.clients.billboard_artist_client import get_billboard_artist

  
def get_artist_of_the_year(year: int) ->list[str]:
    
    response, table_class = get_billboard_artist(year)
    
    if response is None or table_class is None: 
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
      