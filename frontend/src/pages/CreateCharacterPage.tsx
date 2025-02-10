import React from 'react';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CharacterForm } from '../components/CharacterForm';
import { Character } from '../types/character';
import { characterApi } from '../services/api';

export const CreateCharacterPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (character: Character) => {
        try {
            await characterApi.createCharacter(character);
            navigate('/');
        } catch (error) {
            console.error('Error creating character:', error);
            // TODO: Add error handling UI
        }
    };

    return (
        <Container>
            <CharacterForm onSubmit={handleSubmit} />
        </Container>
    );
}; 