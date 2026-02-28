import { Schema, model, models } from "mongoose";

export interface IIncident {
  title: string;
  description: string;
  category: string;
  location: string;
  status: "pending" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  reporterName: string;
  reporterRole: "student" | "instructor";
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
}

const IncidentSchema = new Schema<IIncident>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  reporterName: { type: String, required: true },
  reporterRole: {
    type: String,
    enum: ["student", "instructor"],
    required: true,
  },
  assignedTo: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Incident =
  models.Incident || model<IIncident>("Incident", IncidentSchema);

export default Incident;
