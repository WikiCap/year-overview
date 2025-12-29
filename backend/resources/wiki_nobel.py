import requests

WIKI_API = "https://en.wikipedia.org/w/api.php"

HEADERS = {
    "User-Agent": "WikiCap/1.0 (school project; contact: alex@example.com)",
    "Accept": "application/json",
    "Accept-Language": "en",
}

def get_nobel_prizes(year: int) -> dict:
    title = f"{year}_Nobel_Prize"

    params = {
        "action": "parse",
        "page": title,
        "prop": "wikitext",
        "format": "json",
        "formatversion": "2",
    }

    r = requests.get(WIKI_API, params=params, headers=HEADERS, timeout=20)
    r.raise_for_status()
    data = r.json()

    wikitext = (data.get("parse", {}).get("wikitext") or "")

    return {"year": year, "laureates": [], "raw_len": len(wikitext)}
