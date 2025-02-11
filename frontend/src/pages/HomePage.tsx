import React, { useEffect, useState } from 'react';
import { Button, Container, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CharacterList } from '../components/CharacterList';
import { characterApi } from '../services/api';
import AddIcon from '@mui/icons-material/Add';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [characters, setCharacters] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCharacters();
    }, []);

    const loadCharacters = async () => {
        try {
            setLoading(true);
            const characterList = await characterApi.listCharacters();
            setCharacters(characterList);
        } catch (error) {
            console.error('Error loading characters:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCharacterDeleted = () => {
        loadCharacters();
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.4
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.4 }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
        >
            <Container maxWidth="md" sx={{ py: 4 }}>
                <motion.div variants={itemVariants}>
                    <Typography 
                        variant="h2" 
                        component="h1" 
                        gutterBottom 
                        align="center"
                        sx={{ 
                            mb: 4,
                            color: 'primary.main',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                            fontFamily: '"MedievalSharp", serif'
                        }}
                    >
                        D&D Character Vault
                    </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            justifyContent: 'flex-end', 
                            mb: 4 
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/create')}
                            className="fantasy-button"
                            sx={{
                                fontFamily: '"Merriweather", serif',
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                py: 1.5,
                                px: 4,
                                borderRadius: 2,
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
                                }
                            }}
                        >
                            Create New Character
                        </Button>
                    </Box>
                </motion.div>

                <motion.div variants={itemVariants}>
                    {loading ? (
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                minHeight: '200px'
                            }}
                        >
                            <div className="loading-spinner" />
                        </Box>
                    ) : (
                        <CharacterList 
                            characters={characters} 
                            onCharacterDeleted={handleCharacterDeleted}
                            onCharacterImported={handleCharacterDeleted}
                        />
                    )}
                </motion.div>
            </Container>
        </motion.div>
    );
}; 