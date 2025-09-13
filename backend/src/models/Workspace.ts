import mongoose, { Schema } from "mongoose";

export interface IWorkspace {
  teamId: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  scope?: string;
  botUserId?: string;
}

const WorkspaceSchema = new Schema<IWorkspace>({
  teamId: { type: String, unique: true, required: true },
  accessToken: String,
  refreshToken: String,
  tokenExpiresAt: Date,
  scope: String,
  botUserId: String
});

export default mongoose.model<IWorkspace>("Workspace", WorkspaceSchema);

