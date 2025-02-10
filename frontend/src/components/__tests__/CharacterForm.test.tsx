import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CharacterForm } from '../CharacterForm';

describe('CharacterForm', () => {
    const mockSubmit = vi.fn();
    const mockInitialValues = {
        name: 'Gandalf',
        race: 'Maiar',
        character_class: 'Wizard',
        level: 20,
        ability_scores: {
            strength: 10,
            dexterity: 12,
            constitution: 14,
            intelligence: 18,
            wisdom: 20,
            charisma: 16
        },
        max_hp: 100,
        current_hp: 85,
        inventory: [
            {
                name: 'Staff',
                quantity: 1,
                description: 'A magical staff'
            }
        ]
    };

    it('renders form fields correctly', () => {
        render(<CharacterForm onSubmit={mockSubmit} />);
        
        // Check basic fields
        expect(screen.getByLabelText(/character name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/race/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/class/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/level/i)).toBeInTheDocument();
        
        // Check ability scores
        expect(screen.getByLabelText(/strength/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/dexterity/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/constitution/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/intelligence/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/wisdom/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/charisma/i)).toBeInTheDocument();
        
        // Check HP fields
        expect(screen.getByLabelText(/max hp/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/current hp/i)).toBeInTheDocument();
    });

    it('loads initial values correctly', () => {
        render(<CharacterForm onSubmit={mockSubmit} initialValues={mockInitialValues} />);
        
        expect(screen.getByLabelText(/character name/i)).toHaveValue('Gandalf');
        expect(screen.getByLabelText(/race/i)).toHaveValue('Maiar');
        expect(screen.getByLabelText(/class/i)).toHaveValue('Wizard');
        expect(screen.getByLabelText(/level/i)).toHaveValue(20);
        
        // Check ability scores
        expect(screen.getByLabelText(/strength/i)).toHaveValue(10);
        expect(screen.getByLabelText(/wisdom/i)).toHaveValue(20);
        
        // Check HP
        expect(screen.getByLabelText(/max hp/i)).toHaveValue(100);
        expect(screen.getByLabelText(/current hp/i)).toHaveValue(85);
    });

    it('handles inventory management', async () => {
        const user = userEvent.setup();
        render(<CharacterForm onSubmit={mockSubmit} />);
        
        // Add inventory item
        const addButton = screen.getByLabelText(/add/i);
        await user.click(addButton);
        
        // Fill in item details
        const itemNameInput = screen.getByLabelText(/item name/i);
        const quantityInput = screen.getByLabelText(/quantity/i);
        
        await user.type(itemNameInput, 'Sword');
        await user.type(quantityInput, '1');
        
        // Remove item
        const removeButton = screen.getByLabelText(/delete/i);
        await user.click(removeButton);
        
        // Verify item was removed
        expect(screen.queryByDisplayValue('Sword')).not.toBeInTheDocument();
    });

    it('validates required fields', async () => {
        const user = userEvent.setup();
        render(<CharacterForm onSubmit={mockSubmit} />);
        
        // Try to submit empty form
        const submitButton = screen.getByText(/save character/i);
        await user.click(submitButton);
        
        // Check for validation messages
        await waitFor(() => {
            expect(screen.getByText(/name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/race is required/i)).toBeInTheDocument();
            expect(screen.getByText(/class is required/i)).toBeInTheDocument();
        });
    });

    it('submits form with valid data', async () => {
        const user = userEvent.setup();
        render(<CharacterForm onSubmit={mockSubmit} />);
        
        // Fill in required fields
        await user.type(screen.getByLabelText(/character name/i), 'Test Character');
        await user.type(screen.getByLabelText(/race/i), 'Human');
        await user.type(screen.getByLabelText(/class/i), 'Fighter');
        
        // Submit form
        const submitButton = screen.getByText(/save character/i);
        await user.click(submitButton);
        
        // Check if onSubmit was called
        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalled();
        });
    });
}); 