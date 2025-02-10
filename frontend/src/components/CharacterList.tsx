import React, { useRef } from 'react';
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
    Button,
    Box,
    Snackbar,
    Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { useNavigate } from 'react-router-dom';
import { characterApi } from '../services/api';

interface CharacterListProps {
    characters: string[];
    onCharacterDeleted?: () => void;
    onCharacterImported?: () => void;
}

export const CharacterList: React.FC<CharacterListProps> = ({ 
    characters, 
    onCharacterDeleted,
    onCharacterImported 
}) => {
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [characterToDelete, setCharacterToDelete] = React.useState<string | null>(null);
    const [snackbar, setSnackbar] = React.useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success'
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleExportCharacter = async (name: string) => {
        try {
            await characterApi.exportCharacter(name);
            setSnackbar({
                open: true,
                message: 'Character exported successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error exporting character:', error);
            setSnackbar({
                open: true,
                message: 'Failed to export character',
                severity: 'error'
            });
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            await characterApi.importCharacter(file);
            setSnackbar({
                open: true,
                message: 'Character imported successfully',
                severity: 'success'
            });
            if (onCharacterImported) {
                onCharacterImported();
            }
        } catch (error) {
            console.error('Error importing character:', error);
            setSnackbar({
                open: true,
                message: 'Failed to import character',
                severity: 'error'
            });
        }

        // Reset the file input
        if (event.target) {
            event.target.value = '';
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <>
            <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4">
                        Characters
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<UploadIcon />}
                        onClick={handleImportClick}
                    >
                        Import Character
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".json"
                        onChange={handleFileChange}
                        data-testid="file-input"
                    />
                </Box>
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
                                        aria-label="export"
                                        onClick={() => handleExportCharacter(name)}
                                        sx={{ mr: 1 }}
                                    >
                                        <DownloadIcon />
                                    </IconButton>
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

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}; 