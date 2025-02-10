"""Unit tests for API endpoints."""
import pytest
import shutil
from pathlib import Path
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture(autouse=True)
def clean_test_data():
    """Clean up test data before and after each test."""
    test_dir = Path("data/characters")
    if test_dir.exists():
        shutil.rmtree(test_dir)
    test_dir.mkdir(parents=True)
    yield
    if test_dir.exists():
        shutil.rmtree(test_dir)

@pytest.fixture
def test_character_data():
    """Fixture providing test character data."""
    return {
        "name": "Test Character",
        "race": "Human",
        "character_class": "Fighter",
        "level": 1,
        "ability_scores": {
            "strength": 10,
            "dexterity": 12,
            "constitution": 14,
            "intelligence": 16,
            "wisdom": 14,
            "charisma": 12
        },
        "max_hp": 10,
        "current_hp": 10,
        "inventory": [
            {
                "name": "Sword",
                "quantity": 1,
                "description": "A sharp sword"
            }
        ]
    }

def test_read_root():
    """Test the root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to D&D Character Builder API"}

def test_create_character(test_character_data):
    """Test creating a character."""
    response = client.post("/characters/", json=test_character_data)
    assert response.status_code == 200
    assert response.json() is True

def test_create_duplicate_character(test_character_data):
    """Test creating a duplicate character."""
    # Create first character
    response = client.post("/characters/", json=test_character_data)
    assert response.status_code == 200
    
    # Try to create duplicate
    response = client.post("/characters/", json=test_character_data)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_create_invalid_character():
    """Test creating an invalid character."""
    invalid_data = {
        "name": "Test Character",
        "race": "Human",
        "character_class": "Fighter",
        "level": 0,  # Invalid level
        "ability_scores": {
            "strength": 10,
            "dexterity": 12,
            "constitution": 14,
            "intelligence": 16,
            "wisdom": 14,
            "charisma": 12
        },
        "max_hp": 10,
        "current_hp": 10
    }
    response = client.post("/characters/", json=invalid_data)
    assert response.status_code == 422  # Validation error

def test_get_character(test_character_data):
    """Test getting a character."""
    # First create a character
    client.post("/characters/", json=test_character_data)
    
    # Then try to get it
    response = client.get(f"/characters/{test_character_data['name']}")
    assert response.status_code == 200
    assert response.json()["name"] == test_character_data["name"]
    assert response.json()["race"] == test_character_data["race"]
    assert response.json()["character_class"] == test_character_data["character_class"]

def test_get_nonexistent_character():
    """Test getting a character that doesn't exist."""
    response = client.get("/characters/NonexistentCharacter")
    assert response.status_code == 404

def test_list_characters(test_character_data):
    """Test listing characters."""
    # First create a character
    client.post("/characters/", json=test_character_data)
    
    # Then list characters
    response = client.get("/characters/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert test_character_data["name"] in response.json()

def test_update_character(test_character_data):
    """Test updating a character."""
    # First create a character
    client.post("/characters/", json=test_character_data)
    
    # Modify the character data
    test_character_data["level"] = 2
    
    # Update the character
    response = client.put(f"/characters/{test_character_data['name']}", json=test_character_data)
    assert response.status_code == 200
    assert response.json() is True
    
    # Verify the update
    response = client.get(f"/characters/{test_character_data['name']}")
    assert response.status_code == 200
    assert response.json()["level"] == 2

def test_update_nonexistent_character(test_character_data):
    """Test updating a character that doesn't exist."""
    response = client.put("/characters/NonexistentCharacter", json=test_character_data)
    assert response.status_code == 404

def test_update_character_name_mismatch(test_character_data):
    """Test updating a character with mismatched names."""
    # First create a character
    client.post("/characters/", json=test_character_data)
    
    # Try to update with different name
    original_name = test_character_data["name"]
    test_character_data["name"] = "Different Name"
    response = client.put(f"/characters/{original_name}", json=test_character_data)
    assert response.status_code == 400  # Bad request because names don't match

def test_delete_character(test_character_data):
    """Test deleting a character."""
    # First create a character
    client.post("/characters/", json=test_character_data)
    
    # Then delete it
    response = client.delete(f"/characters/{test_character_data['name']}")
    assert response.status_code == 200
    assert response.json() is True
    
    # Verify character is deleted
    response = client.get(f"/characters/{test_character_data['name']}")
    assert response.status_code == 404

def test_delete_nonexistent_character():
    """Test deleting a character that doesn't exist."""
    response = client.delete("/characters/NonexistentCharacter")
    assert response.status_code == 404 