import axios from 'axios';
import { Character } from '../types/character';

const API_URL = 'http://localhost:8000';

export const characterApi = {
    async createCharacter(character: Character): Promise<boolean> {
        const response = await axios.post(`${API_URL}/characters/`, character);
        return response.data;
    },

    async getCharacter(name: string): Promise<Character> {
        const response = await axios.get(`${API_URL}/characters/${name}`);
        return response.data;
    },

    async listCharacters(): Promise<string[]> {
        const response = await axios.get(`${API_URL}/characters/`);
        return response.data;
    },

    async updateCharacter(name: string, character: Character): Promise<boolean> {
        const response = await axios.put(`${API_URL}/characters/${name}`, character);
        return response.data;
    },

    async deleteCharacter(name: string): Promise<boolean> {
        const response = await axios.delete(`${API_URL}/characters/${name}`);
        return response.data;
    }
}; 