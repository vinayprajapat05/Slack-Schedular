import { Request, Response } from "express";
import { getAccessTokenForTeam, postMessage, listChannels } from "../services/slackService";
import ScheduledMessage from "../models/ScheduledMessage";
import { scheduleSendJob, cancelJob } from "../agenda";
import Workspace from "../models/Workspace";

export const sendNow = async (req: Request, res: Response) => {
  const { teamId, channel, text } = req.body;
  const token = await getAccessTokenForTeam(teamId);
  const data = await postMessage(token, channel, text);
  if (!data.ok) return res.status(400).json(data);
  res.json(data);
};

export const scheduleMessage = async (req: Request, res: Response) => {
  const { teamId, channel, text, postAt } = req.body;
  const postDate = new Date(postAt);
  const doc = await ScheduledMessage.create({ workspaceTeamId: teamId, channel, text, postAt: postDate });
  const jobId = await scheduleSendJob(String(doc._id), teamId, channel, text, postDate);
  doc.agendaJobId = jobId;
  await doc.save();
  res.json(doc);
};

export const listScheduled = async (req: Request, res: Response) => {
  const { teamId } = req.query;
  const docs = await ScheduledMessage.find({ workspaceTeamId: teamId as string }).sort({ postAt: 1 });
  res.json(docs);
};

export const cancelScheduled = async (req: Request, res: Response) => {
  const { id } = req.params;
  const doc = await ScheduledMessage.findById(id);
  if (!doc) return res.status(404).json({ error: "not found" });
  if (doc.agendaJobId) {
    await cancelJob(doc.agendaJobId);
  }
  doc.status = "canceled";
  await doc.save();
  res.json({ ok: true });
};

export const channelsForTeam = async (req: Request, res: Response) => {
  const { teamId } = req.query;
  const token = await getAccessTokenForTeam(teamId as string);
  const data = await listChannels(token);
  res.json(data);
};

