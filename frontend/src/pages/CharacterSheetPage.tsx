import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, IconButton, Typography, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CharacterSheet } from '../components/CharacterSheet';
import { characterApi } from '../services/api';
import { motion } from 'framer-motion';

export const CharacterSheetPage: React.FC = () => {
    const { name } = useParams<{ name: string }>();
    const navigate = useNavigate();
    const [sheetData, setSheetData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (name) {
            loadCharacterSheet(decodeURIComponent(name));
        }
    }, [name]);

    const loadCharacterSheet = async (characterName: string) => {
        try {
            const data = await characterApi.getCharacterSheet(characterName);
            setSheetData(data);
            setError(null);
        } catch (error) {
            console.error('Error loading character sheet:', error);
            setError('Failed to load character sheet');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
        >
            <Container maxWidth="lg">
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleBack} size="large" sx={{ mr: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="span">
                        Back to Characters
                    </Typography>
                </Box>
                
                {sheetData && <CharacterSheet data={sheetData} />}
            </Container>
        </motion.div>
    );
}; 