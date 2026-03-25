# Smart Student Hub

An AI-Powered Academic Management and Productivity Platform designed for students to manage their academic life efficiently.

## Features

- **AI Study Assistant**: Summarize notes, generate quizzes, and explain complex concepts using Gemini 3.1 Pro.
- **Task Manager**: Track assignments, set deadlines, and prioritize tasks.
- **Notes Management**: Organize study materials with tags and AI-powered summaries.
- **Performance Tracker**: Visualize progress with charts and get AI-driven learning insights.
- **Smart Reminders**: Stay on top of deadlines with personalized alerts.

## Tech Stack

- **Frontend**: React with Vite
- **Styling**: Tailwind CSS
- **Backend**: Express (Full-stack)
- **Database**: Firestore (Firebase)
- **Authentication**: Firebase Auth
- **AI**: Gemini 3.1 Pro (@google/genai)
- **Animations**: Motion

## System Architecture

The application follows a full-stack architecture:
- **Client**: React SPA for the user interface.
- **Server**: Express server for API routes and serving static files.
- **Database**: Firestore for real-time data storage.
- **AI Service**: Integration with Google Gemini API for intelligent features.

## Setup Instructions

1. **Firebase Setup**:
   - Configure a Firebase project and enable Firestore and Authentication (Google Login).
   - Add your Firebase configuration to `firebase-applet-config.json`.

2. **Gemini API Key**:
   - Obtain a Gemini API key from Google AI Studio.
   - Add it to your environment variables as `GEMINI_API_KEY`.

3. **Installation**:
   ```bash
   npm install
   ```

4. **Development**:
   ```bash
   npm run dev
   ```

5. **Build**:
   ```bash
   npm run build
   ```
