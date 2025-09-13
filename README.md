# Slack Scheduler App

This is a full-stack application built with **TypeScript**, **Express**, **MongoDB**, and **React** that integrates with Slack to send and schedule messages.

## Features
- Slack OAuth2 installation flow with token rotation (refresh tokens supported)
- Send messages immediately to a Slack channel
- Schedule messages for a future time
- Manage scheduled messages (list and cancel)
- MongoDB persistence
- Agenda (Mongo-backed) job scheduler for reliable delivery

## Tech Stack
- **Backend**: Node.js, Express, TypeScript, Mongoose, Agenda, Axios
- **Frontend**: React, TypeScript, Axios
- **Database**: MongoDB

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally (or Atlas URI)
- Slack App created in your [Slack Developer Console](https://api.slack.com/apps)

### Slack App Setup
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

### Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your Slack client ID, secret, and Mongo URI
npm install
npm run dev
```

Backend runs by default on **http://localhost:4000**

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs by default on **http://localhost:3000**

### Workflow
1. Open http://localhost:3000
2. Click **Install / Connect Slack** button
3. Authorize in Slack → redirected back to frontend with your team ID
4. Use the composer to send or schedule messages
5. Manage scheduled messages in the list

---

## Notes
- Scheduled jobs are persisted in Mongo via Agenda, so they survive restarts.
- If you want Slack to handle scheduling, replace Agenda jobs with Slack's `chat.scheduleMessage` API.
- For production, configure HTTPS, environment variables, and robust logging/error handling.

---

## License
MIT

