import React from 'react';
import { render, screen } from '@testing-library/react';
import { CharacterSheet } from '../CharacterSheet';

const mockCharacterData = {
    basic_info: {
        name: "Test Character",
        race: "Human",
        class: "Fighter",
        level: 4
    },
    health: {
        max_hp: 35,
        current_hp: 30,
        temp_hp: 5
    },
    ability_scores: {
        strength: { score: 16, modifier: 3 },
        dexterity: { score: 14, modifier: 2 },
        constitution: { score: 15, modifier: 2 },
        intelligence: { score: 12, modifier: 1 },
        wisdom: { score: 13, modifier: 1 },
        charisma: { score: 10, modifier: 0 }
    },
    proficiency_bonus: 2,
    inventory: [
        {
            name: "Longsword",
            quantity: 1,
            description: "A standard longsword"
        }
    ]
};

describe('CharacterSheet', () => {
    it('renders character basic information', () => {
        render(<CharacterSheet data={mockCharacterData} />);
        
        expect(screen.getByText('Test Character')).toBeInTheDocument();
        expect(screen.getByText('Level 4 Human Fighter')).toBeInTheDocument();
    });

    it('renders ability scores with modifiers', () => {
        render(<CharacterSheet data={mockCharacterData} />);
        
        expect(screen.getByText('strength')).toBeInTheDocument();
        expect(screen.getByText('16')).toBeInTheDocument();
        expect(screen.getByText('+3')).toBeInTheDocument();
    });

    it('renders health information', () => {
        render(<CharacterSheet data={mockCharacterData} />);
        
        expect(screen.getByText('30 / 35')).toBeInTheDocument();
        expect(screen.getByText('Temp HP: 5')).toBeInTheDocument();
    });

    it('renders proficiency bonus', () => {
        render(<CharacterSheet data={mockCharacterData} />);
        
        expect(screen.getByText('Proficiency Bonus')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 4, name: '+2' })).toBeInTheDocument();
    });

    it('renders inventory items', () => {
        render(<CharacterSheet data={mockCharacterData} />);
        
        expect(screen.getByText('Longsword (1)')).toBeInTheDocument();
        expect(screen.getByText('A standard longsword')).toBeInTheDocument();
    });

    it('renders empty inventory message when no items', () => {
        const dataWithNoInventory = {
            ...mockCharacterData,
            inventory: []
        };
        
        render(<CharacterSheet data={dataWithNoInventory} />);
        
        expect(screen.getByText('No items in inventory')).toBeInTheDocument();
    });
}); 