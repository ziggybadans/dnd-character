import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { characterApi } from '../api';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('characterApi', () => {
    const mockCharacter = {
        name: 'Test Character',
        race: 'Human',
        character_class: 'Fighter',
        level: 1,
        ability_scores: {
            strength: 10,
            dexterity: 12,
            constitution: 14,
            intelligence: 16,
            wisdom: 14,
            charisma: 12
        },
        max_hp: 10,
        current_hp: 10,
        inventory: []
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createCharacter', () => {
        it('creates a character successfully', async () => {
            mockedAxios.post.mockResolvedValueOnce({ data: true });
            
            const result = await characterApi.createCharacter(mockCharacter);
            
            expect(result).toBe(true);
            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:8000/characters/',
                mockCharacter
            );
        });

        it('handles creation error', async () => {
            mockedAxios.post.mockRejectedValueOnce(new Error('Failed to create'));
            
            await expect(characterApi.createCharacter(mockCharacter))
                .rejects.toThrow('Failed to create');
        });
    });

    describe('getCharacter', () => {
        it('gets a character successfully', async () => {
            mockedAxios.get.mockResolvedValueOnce({ data: mockCharacter });
            
            const result = await characterApi.getCharacter('Test Character');
            
            expect(result).toEqual(mockCharacter);
            expect(mockedAxios.get).toHaveBeenCalledWith(
                'http://localhost:8000/characters/Test Character'
            );
        });

        it('handles get error', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('Character not found'));
            
            await expect(characterApi.getCharacter('NonExistent'))
                .rejects.toThrow('Character not found');
        });
    });

    describe('listCharacters', () => {
        it('lists characters successfully', async () => {
            const mockCharacterList = ['Character 1', 'Character 2'];
            mockedAxios.get.mockResolvedValueOnce({ data: mockCharacterList });
            
            const result = await characterApi.listCharacters();
            
            expect(result).toEqual(mockCharacterList);
            expect(mockedAxios.get).toHaveBeenCalledWith(
                'http://localhost:8000/characters/'
            );
        });

        it('handles list error', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('Failed to list characters'));
            
            await expect(characterApi.listCharacters())
                .rejects.toThrow('Failed to list characters');
        });
    });

    describe('updateCharacter', () => {
        it('updates a character successfully', async () => {
            mockedAxios.put.mockResolvedValueOnce({ data: true });
            
            const result = await characterApi.updateCharacter('Test Character', mockCharacter);
            
            expect(result).toBe(true);
            expect(mockedAxios.put).toHaveBeenCalledWith(
                'http://localhost:8000/characters/Test Character',
                mockCharacter
            );
        });

        it('handles update error', async () => {
            mockedAxios.put.mockRejectedValueOnce(new Error('Failed to update'));
            
            await expect(characterApi.updateCharacter('Test Character', mockCharacter))
                .rejects.toThrow('Failed to update');
        });
    });
}); 