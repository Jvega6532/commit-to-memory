# Software Engineering Journal Application

A full-stack web application our team built for tracking development work with journal entries and todo lists. We used FastAPI for the backend, React for the frontend, and PostgreSQL for the database.

## What This App Does

This application helps developers keep a log of their project work. You can create journal entries about what you're working on, and each entry can have its own list of todos. The app automatically tracks dates and lets you organize everything in one place.

## What We Built With

### Backend
- **FastAPI** - Python web framework for the API
- **SQLAlchemy** - Makes working with the database easier
- **PostgreSQL** - Database for storing everything
- **Pydantic** - Validates data to make sure it's correct

### Frontend
- **React 19** - JavaScript library for the user interface
- **Vite 7** - Development server and build tool
- **React Router 7** - Handles navigation between pages
- **Tailwind CSS 4** - CSS framework for styling

### Deployment
- **Docker** - Containerizes the application
- **Docker Compose** - Runs all the containers together

## Features

- Create, read, update, and delete journal entries
- Each entry has:
  - Automatic post date
  - Project link
  - Title
  - Description/content
- Todo list functionality:
  - Add tasks to any entry
  - Mark tasks complete or incomplete
  - Edit and delete tasks
- View all todos from all entries
- RESTful API endpoints

## Database Structure

We created two tables:

**entries table**
- `entry_id` - unique ID (primary key)
- `post_date` - date the entry was created
- `proj_link` - link to the project
- `title` - entry title
- `content` - detailed description

**todos table**
- `todo_id` - unique ID (primary key)
- `entry_id` - links to parent entry (foreign key)
- `task` - the task description
- `is_completed` - whether it's done or not

## Getting Started

### What You Need
- Docker installed on your machine
- Docker Compose

### How to Run

1. Start up all the containers:
```bash
docker-compose up --build
```

2. Set up the database tables (only need to do this once):
```bash
docker-compose exec db psql -U postgres -d entries_db -f /docker-entrypoint-initdb.d/tables.sql
```

3. Open your browser:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000`
   - API docs: `http://localhost:8000/docs`

### Shutting Down

Stop the containers:
```bash
docker-compose down
```

If you want to reset everything including the database:
```bash
docker-compose down -v
```

## API Endpoints

### For Entries
- `GET /entries` - Get all entries
- `GET /entries/{entry_id}` - Get a specific entry
- `POST /entries` - Create a new entry
- `PUT /entries/{entry_id}` - Update an entry
- `DELETE /entries/{entry_id}` - Delete an entry (also deletes its todos)

### For Todos
- `GET /todos` - Get all todos
- `GET /entries/{entry_id}/todos` - Get todos for one entry
- `POST /entries/{entry_id}/todos` - Add a todo to an entry
- `PATCH /todos/{todo_id}` - Update a todo
- `PATCH /todos/{todo_id}/complete` - Mark todo as complete/incomplete
- `DELETE /todos/{todo_id}` - Delete a todo

## Project Files

```
├── backend/
│   ├── main.py          # API routes and FastAPI app
│   ├── db.py            # Database functions
│   ├── db_models.py     # SQLAlchemy table models
│   ├── schemas.py       # Pydantic data models
│   ├── tables.sql       # SQL to create tables
│   └── requirements.txt # Python packages needed
│
├── frontend/
│   ├── src/             # React components
│   ├── package.json     # JavaScript packages needed
│   └── vite.config.js   # Vite settings
│
└── docker-compose.yml   # Docker configuration
```

## Development Notes

### Working with Docker
- The backend has auto-reload so changes show up automatically
- Frontend uses Vite's hot module replacement for instant updates
- CORS is configured so the frontend and backend can communicate
- ESLint helps keep the code clean

### Running Without Docker
If you want to run things locally without Docker:

**Backend:**
```bash
pip install -r requirements.txt
fastapi dev main.py
```
(You'll need to update the database URL in `db.py` to point to your local PostgreSQL)

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Important Details

- The `tables.sql` file includes some sample data to test with
- When you delete an entry, all its todos get deleted automatically (foreign key constraint)
- The post date is set automatically when you create an entry
- Database URL in `db.py` is set to `postgresql+psycopg://postgres:postgres@localhost:5432/entries_db`

## Team Project

We built this as a team project, splitting up the work between backend development, frontend implementation, database design, and Docker configuration.