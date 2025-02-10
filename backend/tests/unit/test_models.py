"""Unit tests for character models."""
import pytest
from pydantic import ValidationError
from app.models.character import AbilityScores, InventoryItem, Character

def test_valid_ability_scores():
    """Test creating valid ability scores."""
    scores = AbilityScores(
        strength=10,
        dexterity=12,
        constitution=14,
        intelligence=16,
        wisdom=14,
        charisma=12
    )
    assert scores.strength == 10
    assert scores.dexterity == 12
    assert scores.constitution == 14
    assert scores.intelligence == 16
    assert scores.wisdom == 14
    assert scores.charisma == 12

def test_invalid_ability_scores():
    """Test that invalid ability scores raise ValidationError."""
    with pytest.raises(ValidationError):
        AbilityScores(
            strength=0,  # Invalid: less than minimum (1)
            dexterity=12,
            constitution=14,
            intelligence=16,
            wisdom=14,
            charisma=12
        )
    
    with pytest.raises(ValidationError):
        AbilityScores(
            strength=10,
            dexterity=21,  # Invalid: greater than maximum (20)
            constitution=14,
            intelligence=16,
            wisdom=14,
            charisma=12
        )

def test_valid_inventory_item():
    """Test creating valid inventory item."""
    item = InventoryItem(
        name="Staff",
        quantity=1,
        description="A wooden staff"
    )
    assert item.name == "Staff"
    assert item.quantity == 1
    assert item.description == "A wooden staff"

def test_invalid_inventory_item():
    """Test that invalid inventory items raise ValidationError."""
    with pytest.raises(ValidationError):
        InventoryItem(
            name="Staff",
            quantity=-1  # Invalid: negative quantity
        )

def test_valid_character():
    """Test creating valid character."""
    character = Character(
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
    assert character.name == "Test Character"
    assert character.race == "Human"
    assert character.character_class == "Fighter"
    assert character.level == 1
    assert character.max_hp == 10
    assert character.current_hp == 10
    assert len(character.inventory) == 1

def test_invalid_character():
    """Test that invalid characters raise ValidationError."""
    with pytest.raises(ValidationError):
        Character(
            name="Test Character",
            race="Human",
            character_class="Fighter",
            level=0,  # Invalid: less than minimum (1)
            ability_scores=AbilityScores(
                strength=10,
                dexterity=12,
                constitution=14,
                intelligence=16,
                wisdom=14,
                charisma=12
            ),
            max_hp=10,
            current_hp=10
        )

    with pytest.raises(ValidationError):
        Character(
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
            max_hp=0,  # Invalid: less than minimum (1)
            current_hp=0
        ) 