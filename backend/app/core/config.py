import os

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
BILLBOARD_100_API_KEY = os.getenv("BILLBOARD_100_API_KEY")

if not TMDB_API_KEY:
    raise RuntimeError("TMDB_API_KEY is missing in the environment")

if not BILLBOARD_100_API_KEY:
    raise RuntimeError("BILLBOARD_100_API_KEY is missing in the environment")