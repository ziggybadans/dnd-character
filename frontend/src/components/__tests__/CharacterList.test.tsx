import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CharacterList } from '../CharacterList';
import { characterApi } from '../../services/api';

// Mock the characterApi
vi.mock('../../services/api', () => ({
    characterApi: {
        deleteCharacter: vi.fn()
    }
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('CharacterList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders empty state message when no characters', () => {
        render(
            <BrowserRouter>
                <CharacterList characters={[]} />
            </BrowserRouter>
        );
        
        expect(screen.getByText('No characters found. Create one to get started!')).toBeInTheDocument();
    });

    it('renders list of characters', () => {
        const characters = ['Gandalf', 'Aragorn', 'Legolas'];
        
        render(
            <BrowserRouter>
                <CharacterList characters={characters} />
            </BrowserRouter>
        );
        
        characters.forEach(name => {
            expect(screen.getByText(name)).toBeInTheDocument();
        });
    });

    it('navigates to edit page when edit button is clicked', () => {
        const characters = ['Gandalf'];
        
        render(
            <BrowserRouter>
                <CharacterList characters={characters} />
            </BrowserRouter>
        );
        
        const editButton = screen.getByLabelText('edit');
        fireEvent.click(editButton);
        
        expect(mockNavigate).toHaveBeenCalledWith('/edit/Gandalf');
    });

    it('opens delete confirmation dialog when delete button is clicked', () => {
        const characters = ['Gandalf'];
        
        render(
            <BrowserRouter>
                <CharacterList characters={characters} />
            </BrowserRouter>
        );
        
        const deleteButton = screen.getByLabelText('delete');
        fireEvent.click(deleteButton);
        
        expect(screen.getByText('Delete Character')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to delete Gandalf? This action cannot be undone.')).toBeInTheDocument();
    });

    it('calls deleteCharacter and onCharacterDeleted when delete is confirmed', async () => {
        const characters = ['Gandalf'];
        const onCharacterDeleted = vi.fn();
        (characterApi.deleteCharacter as ReturnType<typeof vi.fn>).mockResolvedValue(true);
        
        render(
            <BrowserRouter>
                <CharacterList characters={characters} onCharacterDeleted={onCharacterDeleted} />
            </BrowserRouter>
        );
        
        // Click delete button
        const deleteButton = screen.getByLabelText('delete');
        fireEvent.click(deleteButton);
        
        // Click confirm in dialog
        const confirmButton = screen.getByText('Delete');
        fireEvent.click(confirmButton);
        
        await waitFor(() => {
            expect(characterApi.deleteCharacter).toHaveBeenCalledWith('Gandalf');
            expect(onCharacterDeleted).toHaveBeenCalled();
        });
    });

    it('closes delete dialog when cancel is clicked', async () => {
        const characters = ['Gandalf'];
        
        render(
            <BrowserRouter>
                <CharacterList characters={characters} />
            </BrowserRouter>
        );
        
        // Open dialog
        const deleteButton = screen.getByLabelText('delete');
        fireEvent.click(deleteButton);
        
        // Click cancel
        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);
        
        // Wait for dialog to close
        await waitFor(() => {
            expect(screen.queryByText('Delete Character')).not.toBeInTheDocument();
        });
    });
}); 