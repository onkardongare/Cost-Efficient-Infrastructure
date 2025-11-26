// src/models/project.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { Project, ProjectStatus, GeoJSONGeometry, UtilityType } from "../types/project";

interface ProjectDoc extends Document {
  name: string;
  description?: string;
  ownerId: string;
  status: ProjectStatus;
  geometry?: GeoJSONGeometry;
  startDate?: Date;
  endDate?: Date;
  approved: boolean;
  approvedById?: string;
  approvedAt?: Date;
  utilityType: UtilityType;
}

const ProjectSchema = new Schema<ProjectDoc>(
  {
    name: { type: String, required: true },
    description: { type: String },
    ownerId: { type: String, required: true }, // user.id
    status: {
      type: String,
      enum: ["planning", "active", "completed", "pending"],
      default: "pending",
    },
    geometry: { type: Schema.Types.Mixed }, // store raw GeoJSON
    startDate: { type: Date },
    endDate: { type: Date },
    approved: { type: Boolean, default: false },
    approvedById: { type: String },
    approvedAt: { type: Date },
    utilityType: {
      type: String,
      enum: ["Sewage", "Water Pipeline", "Electric Line", "Fiber Optic", "LPG Line"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProjectModel: Model<ProjectDoc> =
  mongoose.models.Project ||
  mongoose.model<ProjectDoc>("Project", ProjectSchema);

export const projectModel = {
  async findByNameAndOwner(name: string, ownerId: string): Promise<Project | null> {
      const doc = await ProjectModel.findOne({ name, ownerId }).exec();
      if (!doc) return null;
      return {
        id: doc._id.toString(),
        name: doc.name,
        description: doc.description,
        ownerId: doc.ownerId,
        status: doc.status,
        geometry: doc.geometry as GeoJSONGeometry | undefined,
        startDate: doc.startDate?.toISOString(),
         endDate: doc.endDate?.toISOString(),
        approved: doc.approved,
        approvedById: doc.approvedById,
        approvedAt: doc.approvedAt?.toISOString(),
        utilityType: doc.utilityType,
      };
  },
  async create(data: {
    name: string;
    description?: string;
    ownerId: string;
    status?: ProjectStatus;
    geometry?: GeoJSONGeometry;
    startDate?: string | Date;
    endDate?: string | Date;
    utilityType: UtilityType;
  }): Promise<Project> {
    console.log("data",data)
    const doc = await ProjectModel.create(data);
    console.log("doc",doc)
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      ownerId: doc.ownerId,
      status: doc.status,
      geometry: doc.geometry as GeoJSONGeometry | undefined,
      startDate: doc.startDate?.toISOString(),
      endDate: doc.endDate?.toISOString(),
      approved: doc.approved,
      approvedById: doc.approvedById,
      approvedAt: doc.approvedAt?.toISOString(),
      utilityType: doc.utilityType,
    };
  },

  async findById(id: string): Promise<Project | null> {
    const doc = await ProjectModel.findById(id).exec();
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      ownerId: doc.ownerId,
      status: doc.status,
      geometry: doc.geometry as GeoJSONGeometry | undefined,
      startDate: doc.startDate?.toISOString(),
      endDate: doc.endDate?.toISOString(),
      approved: doc.approved,
      approvedById: doc.approvedById,
      approvedAt: doc.approvedAt?.toISOString(),
      utilityType: doc.utilityType,
    };
  },

  async findAll(utilityType?: UtilityType): Promise<Project[]> {
    const query: any = {};
    if (utilityType) query.utilityType = utilityType;
    const docs = await ProjectModel.find(query).exec();
    return docs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      ownerId: doc.ownerId,
      status: doc.status,
      geometry: doc.geometry as GeoJSONGeometry | undefined,
      startDate: doc.startDate?.toISOString(),
      endDate: doc.endDate?.toISOString(),
      approved: doc.approved,
      approvedById: doc.approvedById,
      approvedAt: doc.approvedAt?.toISOString(),
      utilityType: doc.utilityType,
    }));
  },

  async findApproved(utilityType?: UtilityType): Promise<Project[]> {
    const query: any = { approved: true };
    if (utilityType) query.utilityType = utilityType;
    const docs = await ProjectModel.find(query).exec();
    return docs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      ownerId: doc.ownerId,
      status: doc.status,
      geometry: doc.geometry as GeoJSONGeometry | undefined,
      startDate: doc.startDate?.toISOString(),
      endDate: doc.endDate?.toISOString(),
      approved: doc.approved,
      approvedById: doc.approvedById,
      approvedAt: doc.approvedAt?.toISOString(),
      utilityType: doc.utilityType,
    }));
  },

  async findApprovedOrOwner(ownerId: string, utilityType?: UtilityType): Promise<Project[]> {
    const query: any = { $or: [{ approved: true }, { ownerId }] };
    if (utilityType) query.utilityType = utilityType;
    const docs = await ProjectModel.find(query).exec();

    return docs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      ownerId: doc.ownerId,
      status: doc.status,
      geometry: doc.geometry as GeoJSONGeometry | undefined,
      startDate: doc.startDate?.toISOString(),
      endDate: doc.endDate?.toISOString(),
      approved: doc.approved,
      approvedById: doc.approvedById,
      approvedAt: doc.approvedAt?.toISOString(),
      utilityType: doc.utilityType,
    }));
  },

  async update(
    id: string,
    updates: Partial<
      Pick<Project, "name" | "description" | "status" | "geometry" | "approved" | "approvedById" | "approvedAt" | "startDate" | "endDate" | "utilityType">
    >
  ): Promise<Project | null> {
    const doc = await ProjectModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    ).exec();
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      ownerId: doc.ownerId,
      status: doc.status,
      geometry: doc.geometry as GeoJSONGeometry | undefined,
      approved: doc.approved,
      approvedById: doc.approvedById,
      approvedAt: doc.approvedAt?.toISOString(),
      utilityType: doc.utilityType,
    };
  },

  async delete(id: string): Promise<boolean> {
    const res = await ProjectModel.findByIdAndDelete(id).exec();
    return !!res;
  },
};
