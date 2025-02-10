export interface AbilityScores {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
}

export interface InventoryItem {
    name: string;
    quantity: number;
    description?: string;
}

export interface Character {
    name: string;
    race: string;
    character_class: string;
    level: number;
    ability_scores: AbilityScores;
    max_hp: number;
    current_hp: number;
    inventory: InventoryItem[];
} 