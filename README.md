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
python3 -m venv .venv
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

### API Documentation

Once the backend is running, you can access:
- Interactive API documentation: http://localhost:8000/docs
- Alternative API documentation: http://localhost:8000/redoc

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── models/         # Pydantic models
│   │   ├── schemas/        # Request/Response schemas
│   │   └── services/       # Business logic
│   └── tests/
│       ├── unit/          # Unit tests
│       └── integration/   # Integration tests
├── data/
│   └── characters/        # Saved character files
└── frontend/             # React frontend (coming soon)
```

## Future Stages

- Stage 2: Digital character sheet
- Stage 3: In-app dice rolling and expanded D&D 5e functionality
- Stage 4: D&D 5e data files and homebrew support
- Stage 5: User accounts and online character storage 