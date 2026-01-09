from fastapi import APIRouter, HTTPException, status
import httpx
from app.services.wiki_service import fetch_year_summary

router = APIRouter()

@router.get("/year/{year}/wiki", status_code=status.HTTP_200_OK)
def get_year(year: int):
    if year <1800 or year > 2027:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail = "BAD REQUEST: Year must be between 1800 and 2027"
        )

    try:
        events = fetch_year_summary(year)

    except httpx.HTTPError as e:
        if e.response.status_code == 404:
            raise HTTPException(
                status_code = status.HTTP_404_NOT_FOUND,
                detail = f"NOT FOUND: Wikipedia page for year {year} not found."
            )
        raise HTTPException(
            status_code = status.HTTP_502_BAD_GATEWAY,
            detail = "BAD GATEWAY: Error connecting to Wikipedia API."
        )
    except Exception as e:
        raise HTTPException(
            status_code = status.HTTP_503_SERVICE_UNAVAILABLE,
            detail = "SERVICE UNAVAILABLE: An unexpected error occurred."
        )
    if not events:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = f"NOT FOUND: No events found for year {year}."
        )
    return {
        "year": year,
        "events_by_month": events
    }
