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
    },

    async exportCharacter(name: string): Promise<void> {
        const response = await axios.get(`${API_URL}/characters/export/${name}`, {
            responseType: 'blob'
        });
        
        // Create a download link and trigger it
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${name}.json`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },

    async importCharacter(file: File): Promise<boolean> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${API_URL}/characters/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
}; 