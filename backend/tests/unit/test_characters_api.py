"""Unit tests for character API endpoints."""
import pytest
import shutil
from pathlib import Path
from fastapi.testclient import TestClient
from app.main import app
from app.models.character import Character, AbilityScores, InventoryItem

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture(autouse=True)
def cleanup():
    """Clean up the test data directory before and after each test."""
    data_dir = Path("data/characters")
    if data_dir.exists():
        shutil.rmtree(data_dir)
    data_dir.mkdir(parents=True, exist_ok=True)
    yield
    if data_dir.exists():
        shutil.rmtree(data_dir)

@pytest.fixture
def test_character():
    """Fixture providing a test character."""
    return Character(
        name="Test Character",
        race="Human",
        character_class="Fighter",
        level=1,
        ability_scores=AbilityScores(
            strength=10,
            dexterity=12,
            constitution=14,
            intelligence=16,
            wisdom=14,
            charisma=12
        ),
        max_hp=10,
        current_hp=10,
        inventory=[
            InventoryItem(
                name="Sword",
                quantity=1,
                description="A sharp sword"
            )
        ]
    )

def test_create_character(client, test_character):
    """Test creating a new character."""
    response = client.post("/characters/", json=test_character.model_dump())
    assert response.status_code == 200
    assert response.json() is True

def test_create_duplicate_character(client, test_character):
    """Test creating a character that already exists."""
    # First create the character
    client.post("/characters/", json=test_character.model_dump())
    
    # Try to create it again
    response = client.post("/characters/", json=test_character.model_dump())
    assert response.status_code == 400
    assert response.json()["detail"] == "Character already exists"

def test_get_character(client, test_character):
    """Test getting a character by name."""
    # First create the character
    client.post("/characters/", json=test_character.model_dump())
    
    # Then get it
    response = client.get(f"/characters/{test_character.name}")
    assert response.status_code == 200
    assert response.json()["name"] == test_character.name

def test_get_nonexistent_character(client):
    """Test getting a character that doesn't exist."""
    response = client.get("/characters/NonexistentCharacter")
    assert response.status_code == 404
    assert response.json()["detail"] == "Character not found"

def test_list_characters(client, test_character):
    """Test listing all characters."""
    # Initially, no characters
    response = client.get("/characters/")
    assert response.status_code == 200
    assert len(response.json()) == 0
    
    # Create a character
    client.post("/characters/", json=test_character.model_dump())
    
    # List should now contain one character
    response = client.get("/characters/")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert test_character.name in response.json()

def test_update_character(client, test_character):
    """Test updating a character."""
    # First create the character
    client.post("/characters/", json=test_character.model_dump())
    
    # Update the character
    updated_character = test_character.model_copy()
    updated_character.level = 2
    
    response = client.put(f"/characters/{test_character.name}", json=updated_character.model_dump())
    assert response.status_code == 200
    assert response.json() is True
    
    # Verify the update
    response = client.get(f"/characters/{test_character.name}")
    assert response.status_code == 200
    assert response.json()["level"] == 2

def test_update_nonexistent_character(client, test_character):
    """Test updating a character that doesn't exist."""
    response = client.put("/characters/NonexistentCharacter", json=test_character.model_dump())
    assert response.status_code == 404
    assert response.json()["detail"] == "Character not found"

def test_update_character_name_mismatch(client, test_character):
    """Test updating a character with mismatched names."""
    # First create the character
    client.post("/characters/", json=test_character.model_dump())
    
    # Try to update with different name
    updated_character = test_character.model_copy()
    updated_character.name = "Different Name"
    
    response = client.put(f"/characters/{test_character.name}", json=updated_character.model_dump())
    assert response.status_code == 400
    assert response.json()["detail"] == "Character name mismatch"

def test_delete_character(client, test_character):
    """Test deleting a character."""
    # First create the character
    client.post("/characters/", json=test_character.model_dump())
    
    # Delete it
    response = client.delete(f"/characters/{test_character.name}")
    assert response.status_code == 200
    assert response.json() is True
    
    # Verify it's gone
    response = client.get(f"/characters/{test_character.name}")
    assert response.status_code == 404

def test_delete_nonexistent_character(client):
    """Test deleting a character that doesn't exist."""
    response = client.delete("/characters/NonexistentCharacter")
    assert response.status_code == 404
    assert response.json()["detail"] == "Character not found"

def test_export_character(client, test_character):
    """Test exporting a character."""
    # First create the character
    client.post("/characters/", json=test_character.model_dump())
    
    # Export it
    response = client.get(f"/characters/export/{test_character.name}")
    assert response.status_code == 200
    assert response.headers["content-disposition"] == f'attachment; filename="{test_character.name}.json"'

def test_export_nonexistent_character(client):
    """Test exporting a character that doesn't exist."""
    response = client.get("/characters/export/NonexistentCharacter")
    assert response.status_code == 404
    assert response.json()["detail"] == "Character not found"

def test_import_character(client, test_character):
    """Test importing a character."""
    # Create a JSON file content
    file_content = test_character.model_dump_json().encode('utf-8')
    
    # Import the character
    files = {"file": ("character.json", file_content, "application/json")}
    response = client.post("/characters/import", files=files)
    assert response.status_code == 200
    assert response.json() is True
    
    # Verify the character was imported
    response = client.get(f"/characters/{test_character.name}")
    assert response.status_code == 200
    assert response.json()["name"] == test_character.name

def test_import_invalid_file(client):
    """Test importing an invalid file."""
    # Try to import a non-JSON file
    files = {"file": ("character.txt", b"invalid data", "text/plain")}
    response = client.post("/characters/import", files=files)
    assert response.status_code == 400
    assert response.json()["detail"] == "File must be a JSON file"

def test_import_invalid_character_data(client):
    """Test importing invalid character data."""
    # Create invalid JSON data
    invalid_data = b'{"name": "Invalid"}'  # Missing required fields
    
    files = {"file": ("character.json", invalid_data, "application/json")}
    response = client.post("/characters/import", files=files)
    assert response.status_code == 400
    assert "Invalid character data" in response.json()["detail"]

def test_get_character_sheet_success(client):
    """Test getting a character sheet successfully"""
    # First create a test character
    test_character = {
        "name": "Test Character",
        "race": "Human",
        "character_class": "Fighter",
        "level": 4,
        "ability_scores": {
            "strength": 16,
            "dexterity": 14,
            "constitution": 15,
            "intelligence": 12,
            "wisdom": 13,
            "charisma": 10
        },
        "max_hp": 35,
        "current_hp": 35,
        "inventory": [
            {
                "name": "Longsword",
                "quantity": 1,
                "description": "A standard longsword"
            }
        ]
    }
    
    response = client.post("/characters/", json=test_character)
    assert response.status_code == 200
    
    # Now get the character sheet
    response = client.get(f"/characters/{test_character['name']}/sheet")
    assert response.status_code == 200
    
    data = response.json()
    assert data["basic_info"]["name"] == test_character["name"]
    assert data["basic_info"]["race"] == test_character["race"]
    assert data["basic_info"]["class"] == test_character["character_class"]
    assert data["basic_info"]["level"] == test_character["level"]
    
    # Test ability score modifiers
    assert data["ability_scores"]["strength"]["score"] == 16
    assert data["ability_scores"]["strength"]["modifier"] == 3
    assert data["ability_scores"]["dexterity"]["modifier"] == 2
    
    # Test proficiency bonus calculation
    assert data["proficiency_bonus"] == 2

def test_get_character_sheet_not_found(client):
    """Test getting a character sheet for a non-existent character"""
    response = client.get("/characters/NonExistentCharacter/sheet")
    assert response.status_code == 404
    assert response.json()["detail"] == "Character not found" 