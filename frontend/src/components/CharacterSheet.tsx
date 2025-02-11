import React from 'react';
import {
    Paper,
    Typography,
    Grid,
    Box,
    Divider,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const SheetPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    backgroundColor: '#fdf6e3',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("/parchment-texture.png")',
        backgroundSize: 'cover',
        opacity: 0.1,
        borderRadius: '8px',
        pointerEvents: 'none',
    }
}));

const StatBox = styled(Box)(({ theme }) => ({
    border: '2px solid #8b4513',
    borderRadius: '8px',
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    minHeight: '100px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontFamily: '"MedievalSharp", serif',
    color: '#8b4513',
    marginBottom: theme.spacing(2),
    borderBottom: '2px solid #8b4513',
    paddingBottom: theme.spacing(1)
}));

interface CharacterSheetProps {
    data: {
        basic_info: {
            name: string;
            race: string;
            class: string;
            level: number;
        };
        health: {
            max_hp: number;
            current_hp: number;
            temp_hp: number;
        };
        ability_scores: {
            [key: string]: {
                score: number;
                modifier: number;
            };
        };
        proficiency_bonus: number;
        inventory: Array<{
            name: string;
            quantity: number;
            description?: string;
        }>;
    };
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({ data }) => {
    const formatModifier = (mod: number) => mod >= 0 ? `+${mod}` : `${mod}`;

    return (
        <SheetPaper elevation={3}>
            {/* Header Section */}
            <Box mb={4}>
                <Typography variant="h3" align="center" fontFamily="MedievalSharp" color="#8b4513">
                    {data.basic_info.name}
                </Typography>
                <Typography variant="h5" align="center" color="text.secondary">
                    Level {data.basic_info.level} {data.basic_info.race} {data.basic_info.class}
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Ability Scores Section */}
                <Grid item xs={12} md={4}>
                    <SectionTitle variant="h5">Ability Scores</SectionTitle>
                    <Grid container spacing={2}>
                        {Object.entries(data.ability_scores).map(([ability, { score, modifier }]) => (
                            <Grid item xs={6} key={ability}>
                                <StatBox>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                        {ability}
                                    </Typography>
                                    <Typography variant="h4" fontFamily="MedievalSharp">
                                        {score}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {formatModifier(modifier)}
                                    </Typography>
                                </StatBox>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {/* Combat Stats Section */}
                <Grid item xs={12} md={4}>
                    <SectionTitle variant="h5">Combat Stats</SectionTitle>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <StatBox>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Hit Points
                                </Typography>
                                <Typography variant="h4" fontFamily="MedievalSharp">
                                    {data.health.current_hp} / {data.health.max_hp}
                                </Typography>
                                {data.health.temp_hp > 0 && (
                                    <Typography variant="body2" color="text.secondary">
                                        Temp HP: {data.health.temp_hp}
                                    </Typography>
                                )}
                            </StatBox>
                        </Grid>
                        <Grid item xs={12}>
                            <StatBox>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Proficiency Bonus
                                </Typography>
                                <Typography variant="h4" fontFamily="MedievalSharp">
                                    {formatModifier(data.proficiency_bonus)}
                                </Typography>
                            </StatBox>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Inventory Section */}
                <Grid item xs={12} md={4}>
                    <SectionTitle variant="h5">Inventory</SectionTitle>
                    <Box sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '8px',
                        border: '2px solid #8b4513',
                        maxHeight: '300px',
                        overflow: 'auto'
                    }}>
                        <List>
                            {data.inventory.map((item, index) => (
                                <ListItem key={index} divider={index !== data.inventory.length - 1}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1">
                                                {item.name} ({item.quantity})
                                            </Typography>
                                        }
                                        secondary={item.description}
                                    />
                                </ListItem>
                            ))}
                            {data.inventory.length === 0 && (
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" color="text.secondary" align="center">
                                                No items in inventory
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            )}
                        </List>
                    </Box>
                </Grid>
            </Grid>
        </SheetPaper>
    );
}; 