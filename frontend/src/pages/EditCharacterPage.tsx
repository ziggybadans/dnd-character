import React, { useEffect, useState } from 'react';
import { Container, CircularProgress, Box, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { CharacterForm } from '../components/CharacterForm';
import { Character } from '../types/character';
import { characterApi } from '../services/api';

export const EditCharacterPage: React.FC = () => {
    const navigate = useNavigate();
    const { name } = useParams<{ name: string }>();
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (name) {
            loadCharacter(decodeURIComponent(name));
        }
    }, [name]);

    const loadCharacter = async (characterName: string) => {
        try {
            const data = await characterApi.getCharacter(characterName);
            setCharacter(data);
            setError(null);
        } catch (error) {
            console.error('Error loading character:', error);
            setError('Failed to load character');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (updatedCharacter: Character) => {
        if (!name) return;

        try {
            await characterApi.updateCharacter(decodeURIComponent(name), updatedCharacter);
            navigate('/');
        } catch (error) {
            console.error('Error updating character:', error);
            setError('Failed to update character');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!character) {
        return (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography>Character not found</Typography>
            </Box>
        );
    }

    return (
        <Container>
            <CharacterForm initialValues={character} onSubmit={handleSubmit} />
        </Container>
    );
}; 