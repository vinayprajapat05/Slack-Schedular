import { Request, Response } from "express";
import Workspace from "../models/Workspace";
import { exchangeCodeForToken } from "../services/slackService";

export const install = (req: Request, res: Response) => {
  const clientId = process.env.SLACK_CLIENT_ID;
  const redirect = process.env.SLACK_OAUTH_REDIRECT_URI;
  const scope = encodeURIComponent("chat:write,channels:read,groups:read,im:read,mpim:read");
  const url = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(redirect || "")}`;
  res.redirect(url);
};

export const callback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).send("No code");
  const redirect = process.env.SLACK_OAUTH_REDIRECT_URI!;
  const data = await exchangeCodeForToken(code, redirect);
  if (!data.ok) return res.status(500).json(data);
  const teamId = data.team?.id || data.team_id || data.installation?.team?.id;
  const accessToken = data.access_token;
  const refreshToken = data.refresh_token;
  const expiresIn = data.expires_in;
  const ws = await Workspace.findOneAndUpdate({ teamId }, {
    teamId,
    accessToken,
    refreshToken,
    tokenExpiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined,
    scope: data.scope,
    botUserId: data.bot_user_id || data.installation?.bot?.user_id
  }, { upsert: true, new: true });
  res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/?installed=1&team=${teamId}`);
};

