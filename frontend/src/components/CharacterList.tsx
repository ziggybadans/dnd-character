import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Paper,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { characterApi } from '../services/api';

interface CharacterListProps {
    characters: string[];
    onCharacterDeleted?: () => void;
}

export const CharacterList: React.FC<CharacterListProps> = ({ characters, onCharacterDeleted }) => {
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [characterToDelete, setCharacterToDelete] = React.useState<string | null>(null);

    const handleEditCharacter = (name: string) => {
        navigate(`/edit/${encodeURIComponent(name)}`);
    };

    const handleDeleteClick = (name: string) => {
        setCharacterToDelete(name);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (characterToDelete) {
            try {
                await characterApi.deleteCharacter(characterToDelete);
                setDeleteDialogOpen(false);
                setCharacterToDelete(null);
                if (onCharacterDeleted) {
                    onCharacterDeleted();
                }
            } catch (error) {
                console.error('Error deleting character:', error);
                // TODO: Add error handling UI
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setCharacterToDelete(null);
    };

    return (
        <>
            <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Characters
                </Typography>
                {characters.length === 0 ? (
                    <Typography variant="body1" color="text.secondary" align="center">
                        No characters found. Create one to get started!
                    </Typography>
                ) : (
                    <List>
                        {characters.map((name) => (
                            <ListItem key={name}>
                                <ListItemText primary={name} />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        aria-label="edit"
                                        onClick={() => handleEditCharacter(name)}
                                        sx={{ mr: 1 }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleDeleteClick(name)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">Delete Character</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete {characterToDelete}? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}; 