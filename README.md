# ChadGPT

ChadGPT is a full stack AI chat application built with the MERN stack. It provides an interactive chat experience with authentication, conversation history, and rich markdown based AI responses.

## Tech Stack

### Frontend

- React 19
- Vite
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Router
- Clerk Authentication
- Axios
- React Markdown with syntax highlighting
- Highlight.js
- Lucide Icons
- Motion animations
- Material UI components

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- Clerk for authentication
- Google GenAI SDK
- Inngest for background jobs
- CORS
- dotenv

## Features

- Secure authentication using Clerk
- Real time AI chat interface
- Persistent chat history stored in MongoDB
- Markdown rendering with code syntax highlighting
- Clean and responsive UI
- Background job handling with Inngest

## Project Structure

```
/frontend   React client
/backend    Express API server
```

## Setup Instructions

### Clone the repository

```
git clone <repo-url>
cd chadgpt
```

### Frontend setup

```
cd frontend
npm install
npm run dev
```

### Backend setup

```
cd backend
npm install
npm start
```

Create a `.env` file in the backend directory and add your environment variables such as database URL, Clerk keys, and Google GenAI API key.

## Status

This project is actively developed as a learning focused full stack AI application.
