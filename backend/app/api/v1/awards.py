from fastapi import APIRouter
from app.services.awards_service import fetch_oscar_highlights

router = APIRouter()

@router.get("/year/{year}/awards")
def get_awards(year: int):
    return fetch_oscar_highlights(year)