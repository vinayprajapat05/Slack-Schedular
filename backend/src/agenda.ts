import Agenda from "agenda";
import ScheduledMessage from "./models/ScheduledMessage";
import { getAccessTokenForTeam, postMessage } from "./services/slackService";

let agenda: Agenda;

export async function setupAgenda() {
  const mongoUrl = process.env.MONGO_URI!;
  agenda = new Agenda({
    db: {
      address: mongoUrl,
      collection: process.env.AGENDADB_COLLECTION || "agendaJobs"
    }
  });

  agenda.define("send-scheduled-message", async (job:any) => {
    const { scheduledId } = job.attrs.data as any;
    const doc = await ScheduledMessage.findById(scheduledId);
    if (!doc) return;
    if (doc.status !== "scheduled") return;
    try {
      const token = await getAccessTokenForTeam(doc.workspaceTeamId);
      const resp = await postMessage(token, doc.channel, doc.text);
      if (resp.ok) {
        doc.status = "sent";
      } else {
        doc.status = "failed";
      }
    } catch (err) {
      doc.status = "failed";
    }
    await doc.save();
  });

  await agenda.start();
  console.log("Agenda started");
}

export async function scheduleSendJob(
  scheduledId: string,
  teamId: string,
  channel: string,
  text: string,
  when: Date
) {
  if (!agenda) throw new Error("agenda not initialized");
  const job = agenda.create("send-scheduled-message", { scheduledId });
  job.schedule(when);
  const j = await job.save();
  return String(j.attrs._id);
}

export async function cancelJob(jobId: string) {
  if (!agenda) throw new Error("agenda not initialized");
  await agenda.cancel({ _id: jobId });
}
