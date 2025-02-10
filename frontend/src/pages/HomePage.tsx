import React, { useEffect, useState } from 'react';
import { Button, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CharacterList } from '../components/CharacterList';
import { characterApi } from '../services/api';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [characters, setCharacters] = useState<string[]>([]);

    useEffect(() => {
        loadCharacters();
    }, []);

    const loadCharacters = async () => {
        try {
            const characterList = await characterApi.listCharacters();
            setCharacters(characterList);
        } catch (error) {
            console.error('Error loading characters:', error);
        }
    };

    const handleCharacterDeleted = () => {
        loadCharacters();
    };

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/create')}
                >
                    Create New Character
                </Button>
            </Box>
            <CharacterList characters={characters} onCharacterDeleted={handleCharacterDeleted} />
        </Container>
    );
}; 