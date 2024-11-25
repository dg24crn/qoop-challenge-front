# Managé

Managé is a project management platform designed to help you organize tasks, collaborate with teams, and efficiently manage your workload. The application includes key features such as project creation, task management, team collaboration, and subscription handling.

## Features

- **User Authentication**: Secure registration and login using JWT.
- **Project Management**:
  - Create, view, and delete projects.
  - Add tasks to each project.
- **Team Management**:
  - Create teams and add members by their ID.
  - View information about team members.
- **Subscriptions**:
  - Additional features available for users with active subscriptions.
- **NASA API Integration**:
  - Subscribed users can enjoy daily content from NASA's APOD API.

## Technologies Used

### Frontend
- **React** with **TypeScript**: User interface development.
- **Tailwind CSS**: Modern and responsive design.
- **Vite**: Development and build tool.

### Backend
- **FastAPI**: A fast and efficient Python backend framework.
- **PostgreSQL**: Relational database for storing information.
- **Render**: Backend deployment.

### Additional Tools
- **Vercel**: Frontend deployment.
- **Axios**: HTTP request handling.
- **JWT**: Secure user authentication.

## Prerequisites

Before using this project, ensure you have the following installed:

- **Node.js** and **npm** (or **yarn**) to run the frontend.
- **Python 3.9+** to run the backend.
- **PostgreSQL** as the database.

## Installation

### Front

1. Clone the repository:
   ```bash
   git clone https://github.com/dg24crn/qoop-challenge-front.git

2. Install dependencies:
    ```bash
    cd qoop-challenge-front
    cd front
    npm i

3. Run local front:
    ```bash
    npm run dev

### Back

1. Clone the repository:
    ```bash
    git clone https://github.com/dg24crn/qoop-challenge-back.git

2. Start virtual environment:
    ```powershell
    cd .\venv\Scripts\Activate.bat

3. Run local back:
    ```powershell
    cd .\venv
    uvicorn app.main:app --reload

## Connect FrontEnd with BackEnd

## Front

1. Create a .env file in the root directory of your Frontend folder

2. Add the next content into your .env file:
    ```bash
    VITE_BACKEND_URL=http://127.0.0.1:8000

## Back

1. Create a .env file in the root directory of your Backend folder

2. Add the next content into your .env file:
    ```bash
    DATABASE_URL=postgresql://<postgres>:<password>@localhost:5432/<database_name>
    SECRET_KEY=a-very-secret-key
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=60

3. Replace <> with your own credentials.
