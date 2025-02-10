from typing import List, Dict, Optional
from pydantic import BaseModel, Field

class AbilityScores(BaseModel):
    strength: int = Field(ge=1, le=20)
    dexterity: int = Field(ge=1, le=20)
    constitution: int = Field(ge=1, le=20)
    intelligence: int = Field(ge=1, le=20)
    wisdom: int = Field(ge=1, le=20)
    charisma: int = Field(ge=1, le=20)

class InventoryItem(BaseModel):
    name: str
    quantity: int = Field(ge=0)
    description: Optional[str] = None

class Character(BaseModel):
    name: str
    race: str
    character_class: str
    level: int = Field(ge=1, le=20)
    ability_scores: AbilityScores
    max_hp: int = Field(ge=1)
    current_hp: int = Field(ge=0)
    inventory: List[InventoryItem] = []
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Gandalf",
                "race": "Human",
                "character_class": "Wizard",
                "level": 1,
                "ability_scores": {
                    "strength": 10,
                    "dexterity": 12,
                    "constitution": 14,
                    "intelligence": 16,
                    "wisdom": 14,
                    "charisma": 12
                },
                "max_hp": 8,
                "current_hp": 8,
                "inventory": [
                    {
                        "name": "Staff",
                        "quantity": 1,
                        "description": "A wooden staff for casting spells"
                    }
                ]
            }
        } 