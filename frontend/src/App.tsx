import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { HomePage } from './pages/HomePage';
import { CreateCharacterPage } from './pages/CreateCharacterPage';
import { EditCharacterPage } from './pages/EditCharacterPage';
import { theme } from './theme/theme';
import './styles/global.css';

// Wrapper component for page transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateCharacterPage />} />
        <Route path="/edit/:name" element={<EditCharacterPage />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AnimatedRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
