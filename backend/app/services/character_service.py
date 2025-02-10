import json
import os
from pathlib import Path
from typing import List, Optional
from ..models.character import Character

class CharacterService:
    def __init__(self):
        self.save_dir = Path("data/characters")
        self.save_dir.mkdir(parents=True, exist_ok=True)

    def save_character(self, character: Character) -> bool:
        """
        Save a character to a JSON file.
        
        Args:
            character (Character): The character to save
            
        Returns:
            bool: True if save was successful, False otherwise
        """
        try:
            file_path = self.save_dir / f"{character.name.lower().replace(' ', '_')}.json"
            with open(file_path, 'w') as f:
                json.dump(character.model_dump(), f, indent=4)
            return True
        except Exception as e:
            print(f"Error saving character: {e}")
            return False

    def load_character(self, character_name: str) -> Optional[Character]:
        """
        Load a character from a JSON file.
        
        Args:
            character_name (str): Name of the character to load
            
        Returns:
            Optional[Character]: The loaded character or None if not found
        """
        try:
            file_path = self.save_dir / f"{character_name.lower().replace(' ', '_')}.json"
            if not file_path.exists():
                return None
            
            with open(file_path, 'r') as f:
                character_data = json.load(f)
            return Character(**character_data)
        except Exception as e:
            print(f"Error loading character: {e}")
            return None

    def list_characters(self) -> List[str]:
        """
        List all saved characters.
        
        Returns:
            List[str]: List of character names (preserving original case)
        """
        try:
            characters = []
            for file_path in self.save_dir.glob('*.json'):
                try:
                    with open(file_path, 'r') as f:
                        character_data = json.load(f)
                        characters.append(character_data["name"])
                except:
                    continue
            return characters
        except Exception as e:
            print(f"Error listing characters: {e}")
            return []

    def delete_character(self, character_name: str) -> bool:
        """
        Delete a character file.
        
        Args:
            character_name (str): Name of the character to delete
            
        Returns:
            bool: True if deletion was successful, False otherwise
        """
        try:
            file_path = self.save_dir / f"{character_name.lower().replace(' ', '_')}.json"
            if not file_path.exists():
                return False
            
            file_path.unlink()
            return True
        except Exception as e:
            print(f"Error deleting character: {e}")
            return False 