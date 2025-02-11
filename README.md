# D&D Character Builder

A web application for creating and managing Dungeons & Dragons 5th Edition characters.

## Features (Stage 1)

- Create characters with race, class, ability scores, level, and inventory
- Save characters to files
- Load existing characters
- Beautiful and clean user interface

## Setup

### Backend

1. Create and activate virtual environment:
```bash
python3.12 -m venv .venv
source .venv/bin/activate  # On Unix/macOS
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the backend server:
```bash
cd backend
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000

### Frontend

1. Install Node.js dependencies:
```bash
cd frontend
npm install
```

2. Run the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

### API Documentation

Once the backend is running, you can access:
- Interactive API documentation: http://localhost:8000/docs
- Alternative API documentation: http://localhost:8000/redoc

## Technology Stack

- Backend:
  - Python 3.12
  - FastAPI
  - SQLite (for data storage)
  - pytest (for testing)

- Frontend:
  - React + TypeScript
  - Vite
  - Jest + React Testing Library

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── models/         # Pydantic models
│   │   ├── schemas/        # Request/Response schemas
│   │   └── services/       # Business logic
│   ├── data/              # Data storage
│   └── tests/
│       ├── unit/          # Unit tests
│       └── integration/   # Integration tests
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   ├── services/      # API integration
    │   └── types/        # TypeScript types
    └── tests/            # Frontend tests
```

## Testing

Both backend and frontend include comprehensive test suites:
- Backend: `pytest` for unit and integration tests
- Frontend: Jest and React Testing Library for component testing

## Future Stages

- Stage 2: Digital character sheet
- Stage 3: In-app dice rolling and expanded D&D 5e functionality
- Stage 4: D&D 5e data files and homebrew support
- Stage 5: User accounts and online character storage 