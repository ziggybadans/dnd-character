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
    Alert,
    Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [characterToDelete, setCharacterToDelete] = React.useState<string>('');
    const [snackbar, setSnackbar] = React.useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleEditCharacter = (name: string) => {
        navigate(`/edit/${encodeURIComponent(name)}`);
    };

    const handleDeleteClick = (name: string) => {
        setCharacterToDelete(name);
        setDeleteDialogOpen(true);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setCharacterToDelete('');
    };

    const handleDeleteConfirm = async () => {
        try {
            await characterApi.deleteCharacter(characterToDelete);
            setSnackbar({
                open: true,
                message: 'Character deleted successfully',
                severity: 'success'
            });
            if (onCharacterDeleted) {
                onCharacterDeleted();
            }
        } catch (error) {
            console.error('Error deleting character:', error);
            setSnackbar({
                open: true,
                message: 'Failed to delete character',
                severity: 'error'
            });
        }
        setDeleteDialogOpen(false);
        setCharacterToDelete('');
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

        if (event.target) {
            event.target.value = '';
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <>
            <Paper 
                elevation={3} 
                className="parchment fantasy-border"
                sx={{ 
                    p: 3,
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            color: 'primary.main',
                            fontFamily: '"MedievalSharp", serif'
                        }}
                    >
                        <MenuBookIcon sx={{ mr: 1, fontSize: '2rem' }} />
                        Character Roster
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<UploadIcon />}
                        onClick={handleImportClick}
                        className="fantasy-button"
                        sx={{
                            fontFamily: '"Merriweather", serif',
                            borderWidth: 2
                        }}
                    >
                        Import
                    </Button>
                </Box>

                {characters.length === 0 ? (
                    <Typography 
                        variant="body1" 
                        color="text.secondary" 
                        align="center"
                        sx={{ 
                            py: 4,
                            fontFamily: '"Merriweather", serif',
                            fontStyle: 'italic'
                        }}
                    >
                        Your adventure awaits! Create your first character to begin.
                    </Typography>
                ) : (
                    <List>
                        <AnimatePresence>
                            {characters.map((name, index) => (
                                <motion.div
                                    key={name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <ListItem
                                        sx={{
                                            mb: 1,
                                            borderRadius: 1,
                                            bgcolor: 'background.paper',
                                            '&:hover': {
                                                bgcolor: 'rgba(139, 69, 19, 0.08)',
                                            },
                                        }}
                                    >
                                        <ListItemText 
                                            primary={
                                                <Typography 
                                                    variant="h6"
                                                    sx={{ 
                                                        fontFamily: '"Merriweather", serif',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {name}
                                                </Typography>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <Tooltip title="View Character Sheet">
                                                <IconButton
                                                    edge="end"
                                                    aria-label="view"
                                                    onClick={() => navigate(`/sheet/${encodeURIComponent(name)}`)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Export Character">
                                                <IconButton
                                                    edge="end"
                                                    aria-label="export"
                                                    onClick={() => handleExportCharacter(name)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    <DownloadIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit Character">
                                                <IconButton
                                                    edge="end"
                                                    aria-label="edit"
                                                    onClick={() => handleEditCharacter(name)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Character">
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() => handleDeleteClick(name)}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </List>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".json"
                    onChange={handleFileChange}
                    data-testid="file-input"
                />
            </Paper>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                PaperProps={{
                    className: 'parchment',
                    sx: { borderRadius: 2 }
                }}
            >
                <DialogTitle sx={{ fontFamily: '"MedievalSharp", serif' }}>
                    Delete Character
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontFamily: '"Merriweather", serif' }}>
                        Are you sure you want to delete {characterToDelete}? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button 
                        onClick={handleDeleteCancel}
                        sx={{ fontFamily: '"Merriweather", serif' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        color="error" 
                        variant="contained"
                        className="fantasy-button"
                        sx={{ fontFamily: '"Merriweather", serif' }}
                    >
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
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbar.severity}
                    sx={{ fontFamily: '"Merriweather", serif' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}; 