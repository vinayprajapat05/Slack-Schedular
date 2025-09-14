
# Slack Scheduler App

This is a full-stack application built with **TypeScript**, **Express**, **MongoDB**, and **React** that integrates with Slack to send and schedule messages.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Architectural Overview](#architectural-overview)
- [Challenges & Learnings](#challenges--learnings)
- [Notes](#notes)
- [License](#license)

---

## Features
- Slack OAuth2 installation flow with token rotation (refresh tokens supported)
- Send messages immediately to a Slack channel
- Schedule messages for a future time
- Manage scheduled messages (list and cancel)
- MongoDB persistence
- Agenda (Mongo-backed) job scheduler for reliable delivery

## Tech Stack
- **Backend**: Node.js, Express, TypeScript, Mongoose, Agenda, Axios
- **Frontend**: React, TypeScript, Material UI, Axios
- **Database**: MongoDB

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally (or Atlas URI)
- Slack App created in your [Slack Developer Console](https://api.slack.com/apps)

### 1. Clone the Repository
```bash
git clone https://github.com/vinayprajapat05/Slack-Schedular.git
cd Slack-Schedular
```

### 2. Slack App Setup
1. Create a new Slack app in your Slack Developer Console.
2. Add the following OAuth scopes:
   - `chat:write`
   - `channels:read`
   - `groups:read`
   - `im:read`
   - `mpim:read`
3. Set **Redirect URL** to:
   ```
   http://localhost:4000/auth/callback
   ```
4. Enable **Token Rotation** in Slack app settings (recommended).
5. Copy your **Client ID** and **Client Secret**.

### 3. Backend Setup
1. Go to the backend folder:
   ```bash
   cd backend
   ```
2. Create a `.env` file and add the following (replace with your values):
   ```env
   PORT=4000
   MONGO_URI=your_mongo_URI
   SLACK_CLIENT_ID=your_client_id
   SLACK_CLIENT_SECRET=your_client_secret
   SLACK_OAUTH_REDIRECT_URI=https://localhost:4000/auth/callback
   BASE_URL=http://localhost:4000
   FRONTEND_URL=http://localhost:3000
   AGENDADB_COLLECTION=agendaJobs
   ```
    
   > **⚠️ Important Note:**
   > When configuring the Slack OAuth redirect URI, make sure to change `https` to `http` while running the project locally in your browser. Update the redirect URI to `http://localhost:4000/auth/callback` in your Slack app settings. The authentication flow will only work if this matches your local setup.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend runs by default on **http://localhost:4000**

### 4. Frontend Setup
1. Go to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm start
   ```
   The frontend runs by default on **http://localhost:3000**

### 5. Workflow
1. Open [http://localhost:3000](http://localhost:3000)
2. Click **Install / Connect Slack** button
3. Authorize in Slack → redirected back to frontend with your team ID
4. Use the composer to send or schedule messages
5. Manage scheduled messages in the list

---

## Architectural Overview

**Backend:**
- **OAuth Flow:**  The backend uses Slack's OAuth2 to authenticate and install the app in a workspace. The user is redirected to Slack for authorization, and upon success, Slack returns a code to the backend, which is exchanged for access and refresh tokens. These tokens, along with workspace details, are stored in MongoDB.
- **Token Management:**  Access tokens are stored with their expiry. When a token is near expiry, the backend uses the refresh token to obtain a new access token from Slack, updating the database. This ensures uninterrupted API access.
- **Scheduled Task Handling:**  The backend uses Agenda (MongoDB-backed job scheduler) to persist and manage scheduled message jobs. When a message is scheduled, a job is created in Agenda. At the scheduled time, Agenda fetches the job, retrieves the latest access token, and sends the message to Slack. Job status is updated in MongoDB.

**Frontend:**
- **Installation & Authentication:**  The frontend provides an "Install/Connect Slack" button, redirecting users to Slack's OAuth flow. After installation, the user is redirected back with their team ID.
- **Message Composer & Scheduler:**  Users can compose and send messages immediately or schedule them for later. Scheduled messages are listed and can be managed (cancelled).
- **API Communication:**  The frontend communicates with the backend via REST API endpoints for installation, sending, scheduling, and managing messages.

---

## Challenges & Learnings

**1. Slack OAuth2 & Token Rotation:**  Implementing Slack's OAuth2 flow with token rotation required careful handling of access and refresh tokens. Slack's documentation is complex, and ensuring tokens are refreshed before expiry was critical to avoid failed API calls. The solution involved tracking token expiry and using refresh tokens to obtain new access tokens automatically.

**2. Reliable Scheduling with Agenda:**  Ensuring scheduled messages were sent reliably, even after server restarts, was a challenge. Using Agenda with MongoDB provided persistence, but required careful job definition and error handling to update message status correctly.

**3. Frontend-Backend Integration:**  Coordinating the OAuth redirect flow between frontend and backend, and passing the team ID securely, required attention to detail. Handling edge cases (e.g., missing tokens, failed installations) improved robustness.

**4. Slack API Rate Limits & Errors:**  Handling Slack API errors and rate limits gracefully was important. The backend includes error handling and status updates for failed jobs, with logging for troubleshooting.

**Learnings:**
- Deepened understanding of OAuth2 flows and token management.
- Gained experience with persistent job scheduling using Agenda.
- Improved skills in error handling, API integration, and full-stack coordination.

---

## Notes
- Scheduled jobs are persisted in Mongo via Agenda, so they survive restarts.
- If you want Slack to handle scheduling, replace Agenda jobs with Slack's `chat.scheduleMessage` API.
- For production, configure HTTPS, environment variables, and robust logging/error handling.


