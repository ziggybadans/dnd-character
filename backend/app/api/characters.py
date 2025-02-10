from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from typing import List
from ..models.character import Character
from ..services.character_service import CharacterService

router = APIRouter(prefix="/characters", tags=["characters"])
character_service = CharacterService()

@router.post("/", response_model=bool)
async def create_character(character: Character):
    """Create a new character"""
    # Check if character already exists
    existing = character_service.load_character(character.name)
    if existing:
        raise HTTPException(status_code=400, detail="Character already exists")
    
    success = character_service.save_character(character)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save character")
    return success

@router.get("/{character_name}", response_model=Character)
async def get_character(character_name: str):
    """Get a character by name"""
    character = character_service.load_character(character_name)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    return character

@router.get("/", response_model=List[str])
async def list_characters():
    """List all characters"""
    return character_service.list_characters()

@router.put("/{character_name}", response_model=bool)
async def update_character(character_name: str, character: Character):
    """Update an existing character"""
    # Check if character exists
    existing = character_service.load_character(character_name)
    if not existing:
        raise HTTPException(status_code=404, detail="Character not found")
    
    # Check if names match (case-insensitive)
    if character_name.lower() != character.name.lower():
        raise HTTPException(status_code=400, detail="Character name mismatch")
    
    success = character_service.save_character(character)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update character")
    return success

@router.delete("/{character_name}", response_model=bool)
async def delete_character(character_name: str):
    """Delete a character by name"""
    # Check if character exists
    existing = character_service.load_character(character_name)
    if not existing:
        raise HTTPException(status_code=404, detail="Character not found")
    
    success = character_service.delete_character(character_name)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete character")
    return success

@router.get("/export/{character_name}")
async def export_character(character_name: str):
    """Export a character as a JSON file"""
    character = character_service.load_character(character_name)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    
    return JSONResponse(
        content=character.model_dump(),
        headers={
            "Content-Disposition": f'attachment; filename="{character_name}.json"'
        }
    )

@router.post("/import")
async def import_character(file: UploadFile = File(...)):
    """Import a character from a JSON file"""
    if not file.filename.endswith('.json'):
        raise HTTPException(status_code=400, detail="File must be a JSON file")
    
    try:
        content = await file.read()
        character_data = content.decode('utf-8')
        character = Character.model_validate_json(character_data)
        
        # Check if character already exists
        existing = character_service.load_character(character.name)
        if existing:
            raise HTTPException(status_code=400, detail="Character already exists")
        
        success = character_service.save_character(character)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to save character")
        return success
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid character data: {str(e)}") 