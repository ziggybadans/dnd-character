import { createTheme } from '@mui/material';

// Fantasy-inspired color palette
const colors = {
  primary: {
    main: '#8b4513', // Saddle brown - leather-like
    light: '#a0522d',
    dark: '#654321',
    contrastText: '#fff',
  },
  secondary: {
    main: '#daa520', // Goldenrod - metallic accents
    light: '#ffd700',
    dark: '#b8860b',
    contrastText: '#000',
  },
  background: {
    default: '#f5e6d3', // Light parchment
    paper: '#fff9e6', // Aged paper
  },
  text: {
    primary: '#2c1810', // Dark brown
    secondary: '#5c2e1a', // Medium brown
  },
};

// Custom transitions and animations
const transitions = {
  create: (props: string | string[], options = {}) => {
    return createTheme().transitions.create(props, {
      duration: 400,
      ...options,
    });
  },
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    ...colors,
  },
  typography: {
    fontFamily: '"MedievalSharp", "Merriweather", serif',
    h1: {
      fontFamily: '"MedievalSharp", serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"MedievalSharp", serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"MedievalSharp", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"MedievalSharp", serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Merriweather", serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Merriweather", serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Merriweather", serif',
    },
    body2: {
      fontFamily: '"Merriweather", serif',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          transition: transitions.create(['transform', 'box-shadow']),
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
          padding: '8px 24px',
          transition: transitions.create([
            'transform',
            'background-color',
            'box-shadow',
          ]),
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: transitions.create(['transform', 'box-shadow']),
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          transition: transitions.create(['background-color', 'transform']),
          '&:hover': {
            backgroundColor: 'rgba(139, 69, 19, 0.08)',
            transform: 'translateX(4px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: transitions.create(['border-color', 'box-shadow']),
            '&:hover': {
              borderColor: colors.primary.main,
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 2px rgba(139, 69, 19, 0.2)',
            },
          },
        },
      },
    },
  },
}); 