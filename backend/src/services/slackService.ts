import axios from "axios";
import WorkspaceModel from "../models/Workspace";
import dayjs from "dayjs";

const SLACK_OAUTH_ACCESS = "https://slack.com/api/oauth.v2.access";
const CHAT_POST = "https://slack.com/api/chat.postMessage";
const CONVERSATIONS_LIST = "https://slack.com/api/conversations.list";

export async function exchangeCodeForToken(code: string, redirect_uri: string) {
  const resp = await axios.post(SLACK_OAUTH_ACCESS, null, {
    params: {
      code,
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      redirect_uri
    }
  });
  return resp.data;
}

export async function refreshAccessToken(teamId: string) {
  const ws = await WorkspaceModel.findOne({ teamId });
  if (!ws || !ws.refreshToken) throw new Error("No workspace/refresh token");
  const resp = await axios.post(SLACK_OAUTH_ACCESS, null, {
    params: {
      grant_type: "refresh_token",
      refresh_token: ws.refreshToken,
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET
    }
  });
  if (!resp.data.ok) throw new Error(resp.data.error || "refresh failed");
  ws.accessToken = resp.data.access_token;
  if (resp.data.expires_in) {
    ws.tokenExpiresAt = dayjs().add(resp.data.expires_in, "second").toDate();
  }
  if (resp.data.refresh_token) ws.refreshToken = resp.data.refresh_token;
  await ws.save();
  return ws;
}

export async function getAccessTokenForTeam(teamId: string) {
  const ws = await WorkspaceModel.findOne({ teamId });
  if (!ws) throw new Error("Workspace not found");
  if (ws.tokenExpiresAt && new Date() > new Date(ws.tokenExpiresAt.getTime() - 2 * 60 * 1000)) {
    await refreshAccessToken(teamId);
  }
  return (await WorkspaceModel.findOne({ teamId }))!.accessToken;
}

export async function postMessage(token: string, channel: string, text: string) {
  const resp = await axios.post(CHAT_POST, { channel, text }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return resp.data;
}

export async function listChannels(token: string) {
  const resp = await axios.get(CONVERSATIONS_LIST, {
    params: { limit: 100 },
    headers: { Authorization: `Bearer ${token}` }
  });
  return resp.data;
}

