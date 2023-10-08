from fastapi import FastAPI, HTTPException, Depends
from models.user import User
from services.storage import StorageService
from models.checkin import Checkin
from models.checkin_request import CheckinRequest
import os

app = FastAPI()

@app.get("/api/registrations")
def list_registrations(storage_service: StorageService = Depends()) -> list[User]:
    """List all registrations in the system."""
    return storage_service.get_registrations()


@app.post("/api/registrations")
def new_registration(user: User, storage_service: StorageService = Depends()) -> User:
    """Create a new user/registration."""
    try:
        return storage_service.create_registration(user)
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))


@app.post("/api/reset")
def reset(storage_service: StorageService = Depends()) -> str:
    """Development-only route for resetting storage module and adding fake user and checkin."""
    if "MODE" in os.environ and os.environ["MODE"] == "production":
        raise HTTPException(status_code=404, detail="Not Found")
    else:
        storage_service.reset()
        storage_service.create_registration(User(pid=710453084, first_name="Kris", last_name="Jordan"))
        storage_service.create_registration(User(pid=730490385, first_name="David", last_name="Williams"))
        storage_service.create_checkin(710453084)
        return "OK"
    

@app.post("/api/checkin")
def checkin(checkin_request: CheckinRequest, storage_service: StorageService = Depends()) -> Checkin:
    """Create a new check-in."""
    try:
        return storage_service.create_checkin(checkin_request.pid)
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
    

@app.get("/api/checkin")
def list_checkins(storage_service: StorageService = Depends()) -> list[Checkin]:
    """List all check-ins."""
    try:
        return storage_service.get_checkins()
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
    
@app.delete("/api/registrations/{pid}")
def delete_registration(pid: int, storage_service: StorageService = Depends()) -> str:
    """Delete a user and their associated check-ins based on the provided PID."""
    try:
        message = storage_service.delete_user(pid)
        return message
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))