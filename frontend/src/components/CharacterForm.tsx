import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    Paper,
    IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Character, AbilityScores, InventoryItem } from '../types/character';

const initialAbilityScores: AbilityScores = {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10
};

const initialInventoryItem: InventoryItem = {
    name: '',
    quantity: 1,
    description: ''
};

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    race: Yup.string().required('Race is required'),
    character_class: Yup.string().required('Class is required'),
    level: Yup.number()
        .required('Level is required')
        .min(1, 'Level must be at least 1')
        .max(20, 'Level cannot exceed 20'),
    max_hp: Yup.number()
        .required('Max HP is required')
        .min(1, 'Max HP must be at least 1'),
    current_hp: Yup.number()
        .required('Current HP is required')
        .min(0, 'Current HP cannot be negative'),
    ability_scores: Yup.object({
        strength: Yup.number().required().min(1).max(20),
        dexterity: Yup.number().required().min(1).max(20),
        constitution: Yup.number().required().min(1).max(20),
        intelligence: Yup.number().required().min(1).max(20),
        wisdom: Yup.number().required().min(1).max(20),
        charisma: Yup.number().required().min(1).max(20)
    })
});

interface CharacterFormProps {
    initialValues?: Character;
    onSubmit: (character: Character) => void;
}

export const CharacterForm: React.FC<CharacterFormProps> = ({ initialValues, onSubmit }) => {
    const formik = useFormik({
        initialValues: initialValues || {
            name: '',
            race: '',
            character_class: '',
            level: 1,
            ability_scores: initialAbilityScores,
            max_hp: 1,
            current_hp: 1,
            inventory: []
        },
        validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
        }
    });

    const addInventoryItem = () => {
        formik.setFieldValue('inventory', [
            ...formik.values.inventory,
            { ...initialInventoryItem }
        ]);
    };

    const removeInventoryItem = (index: number) => {
        const newInventory = [...formik.values.inventory];
        newInventory.splice(index, 1);
        formik.setFieldValue('inventory', newInventory);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 4 }}>
            <form onSubmit={formik.handleSubmit}>
                <Typography variant="h4" gutterBottom>
                    Character Details
                </Typography>

                <Grid container spacing={2}>
                    {/* Basic Info */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Character Name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="race"
                            name="race"
                            label="Race"
                            value={formik.values.race}
                            onChange={formik.handleChange}
                            error={formik.touched.race && Boolean(formik.errors.race)}
                            helperText={formik.touched.race && formik.errors.race}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="character_class"
                            name="character_class"
                            label="Class"
                            value={formik.values.character_class}
                            onChange={formik.handleChange}
                            error={formik.touched.character_class && Boolean(formik.errors.character_class)}
                            helperText={formik.touched.character_class && formik.errors.character_class}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="level"
                            name="level"
                            label="Level"
                            type="number"
                            value={formik.values.level}
                            onChange={formik.handleChange}
                            error={formik.touched.level && Boolean(formik.errors.level)}
                            helperText={formik.touched.level && formik.errors.level}
                        />
                    </Grid>

                    {/* Ability Scores */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Ability Scores
                        </Typography>
                        <Grid container spacing={2}>
                            {Object.keys(initialAbilityScores).map((ability) => (
                                <Grid item xs={6} sm={4} key={ability}>
                                    <TextField
                                        fullWidth
                                        id={`ability_scores.${ability}`}
                                        name={`ability_scores.${ability}`}
                                        label={ability.charAt(0).toUpperCase() + ability.slice(1)}
                                        type="number"
                                        value={formik.values.ability_scores[ability as keyof AbilityScores]}
                                        onChange={formik.handleChange}
                                        error={
                                            formik.touched.ability_scores?.[ability as keyof AbilityScores] &&
                                            Boolean(formik.errors.ability_scores?.[ability as keyof AbilityScores])
                                        }
                                        helperText={
                                            formik.touched.ability_scores?.[ability as keyof AbilityScores] &&
                                            formik.errors.ability_scores?.[ability as keyof AbilityScores]
                                        }
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    {/* HP */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="max_hp"
                            name="max_hp"
                            label="Max HP"
                            type="number"
                            value={formik.values.max_hp}
                            onChange={formik.handleChange}
                            error={formik.touched.max_hp && Boolean(formik.errors.max_hp)}
                            helperText={formik.touched.max_hp && formik.errors.max_hp}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="current_hp"
                            name="current_hp"
                            label="Current HP"
                            type="number"
                            value={formik.values.current_hp}
                            onChange={formik.handleChange}
                            error={formik.touched.current_hp && Boolean(formik.errors.current_hp)}
                            helperText={formik.touched.current_hp && formik.errors.current_hp}
                        />
                    </Grid>

                    {/* Inventory */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">Inventory</Typography>
                            <IconButton onClick={addInventoryItem} color="primary" aria-label="add">
                                <AddIcon />
                            </IconButton>
                        </Box>
                        {formik.values.inventory.map((item, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            name={`inventory.${index}.name`}
                                            label="Item Name"
                                            value={item.name}
                                            onChange={formik.handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <TextField
                                            fullWidth
                                            name={`inventory.${index}.quantity`}
                                            label="Quantity"
                                            type="number"
                                            value={item.quantity}
                                            onChange={formik.handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={5}>
                                        <TextField
                                            fullWidth
                                            name={`inventory.${index}.description`}
                                            label="Description"
                                            value={item.description}
                                            onChange={formik.handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <IconButton onClick={() => removeInventoryItem(index)} color="error" aria-label="delete">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                    >
                        Save Character
                    </Button>
                </Box>
            </form>
        </Paper>
    );
}; 