import mongoose, { Schema } from "mongoose";

export interface IScheduledMessage {
  workspaceTeamId: string;
  channel: string;
  text: string;
  postAt: Date;
  status: "scheduled" | "sent" | "canceled" | "failed";
  agendaJobId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ScheduledSchema = new Schema<IScheduledMessage>({
  workspaceTeamId: { type: String, required: true },
  channel: String,
  text: String,
  postAt: Date,
  status: { type: String, default: "scheduled" },
  agendaJobId: String
}, { timestamps: true });

export default mongoose.model<IScheduledMessage>("ScheduledMessage", ScheduledSchema);

