"""Unit tests for character service."""
import pytest
from pathlib import Path
import shutil
from app.models.character import Character, AbilityScores, InventoryItem
from app.services.character_service import CharacterService

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

@pytest.fixture
def character_service():
    """Fixture providing a character service with test directory."""
    service = CharacterService()
    service.save_dir = Path("test_data/characters")
    service.save_dir.mkdir(parents=True, exist_ok=True)
    yield service
    # Cleanup after tests
    if service.save_dir.exists():
        shutil.rmtree(service.save_dir.parent)

def test_save_character(character_service, test_character):
    """Test saving a character."""
    success = character_service.save_character(test_character)
    assert success
    file_path = character_service.save_dir / f"{test_character.name.lower().replace(' ', '_')}.json"
    assert file_path.exists()

def test_load_character(character_service, test_character):
    """Test loading a character."""
    # First save the character
    character_service.save_character(test_character)
    
    # Then load it
    loaded_character = character_service.load_character(test_character.name)
    assert loaded_character is not None
    assert loaded_character.name == test_character.name
    assert loaded_character.race == test_character.race
    assert loaded_character.character_class == test_character.character_class
    assert loaded_character.level == test_character.level
    assert loaded_character.max_hp == test_character.max_hp
    assert loaded_character.current_hp == test_character.current_hp

def test_load_nonexistent_character(character_service):
    """Test loading a character that doesn't exist."""
    loaded_character = character_service.load_character("NonexistentCharacter")
    assert loaded_character is None

def test_list_characters(character_service, test_character):
    """Test listing characters."""
    # Initially, no characters
    characters = character_service.list_characters()
    assert len(characters) == 0
    
    # Save a character
    character_service.save_character(test_character)
    
    # Check if character appears in list
    characters = character_service.list_characters()
    assert len(characters) == 1
    assert characters[0] == test_character.name

def test_save_character_invalid_path(character_service, test_character):
    """Test saving a character with invalid path."""
    # Set an invalid path
    character_service.save_dir = Path("/invalid/path/that/doesnt/exist")
    success = character_service.save_character(test_character)
    assert not success

def test_delete_character(character_service, test_character):
    """Test deleting a character."""
    # First save the character
    character_service.save_character(test_character)
    
    # Then delete it
    success = character_service.delete_character(test_character.name)
    assert success
    
    # Verify character is deleted
    loaded_character = character_service.load_character(test_character.name)
    assert loaded_character is None

def test_delete_nonexistent_character(character_service):
    """Test deleting a character that doesn't exist."""
    success = character_service.delete_character("NonexistentCharacter")
    assert not success 