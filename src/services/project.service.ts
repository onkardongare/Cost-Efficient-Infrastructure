// src/services/project.service.ts
import { AuthUser } from "../types/user";
import {
  Project,
  CreateProjectBody,
  UpdateProjectBody,
  UtilityType,
} from "../types/project";
import { projectModel } from "../models/project.model";
import {
  canEditProject,
} from "./permissions.service";

export const projectService = {
  // async listProjects(user: AuthUser): Promise<Project[]> {
  //   // Gov: see all
  //   if (user.role === "government_officer") {
  //     return await projectModel.findAll();
  //   }

  //   // Contractor: see approved + own (even if pending)
  //   if (user.role === "contractor") {
  //     return await projectModel.findApprovedOrOwner(user.id);
  //   }

  //   // Citizen: see only approved
  //   return await projectModel.findApproved();
  // },
  async listProjects(user: AuthUser, utilityType?: UtilityType): Promise<Project[]> {
    if (user.role === "government_officer") {
      return await projectModel.findAll(utilityType);
    }

    if (user.role === "contractor") {
      return await projectModel.findApprovedOrOwner(user.id, utilityType);
    }

    return await projectModel.findApproved(utilityType);
  },

  async createProject(
    user: AuthUser,
    payload: CreateProjectBody
  ): Promise<Project> {
    // citizen: no rights
    console.log("utliti", payload.utilityType)
    if (user.role === "citizen") {
      throw new Error("Citizens cannot create projects");
    }

    // Prevent duplicate project with same name for the same owner
    const existing = await projectModel.findByNameAndOwner(payload.name, user.id);
    if (existing) {
      throw new Error("Project with this name already exists for this user");
    }

    // When created, it starts as pending, not approved
    console.log(user, payload);
    return await projectModel.create({
      name: payload.name,
      description: payload.description,
      status: payload.status,
      geometry: payload.geometry,
      startDate: payload.startDate,
      endDate: payload.endDate,
      ownerId: user.id,
      utilityType: payload.utilityType,
    });
  },

  async updateProject(
    user: AuthUser,
    id: string,
    payload: UpdateProjectBody
  ): Promise<Project> {
    const existing = await projectModel.findById(id);
    if (!existing) {
      throw new Error("Project not found");
    }

    if (!canEditProject(user, existing)) {
      throw new Error("Not allowed to edit this project");
    }

    // do NOT let contractor directly change approved fields from here
    const updates: UpdateProjectBody = {
      name: payload.name ?? existing.name,
      description: payload.description ?? existing.description,
      status: payload.status ?? existing.status,
      geometry: payload.geometry ?? existing.geometry,
      startDate: payload.startDate ?? existing.startDate,
      endDate: payload.endDate ?? existing.endDate,
      utilityType: payload.utilityType ?? existing.utilityType,
    };

    const updated = await projectModel.update(id, updates);
    if (!updated) {
      throw new Error("Project not found after update");
    }

    return updated;
  },

  async deleteProject(user: AuthUser, id: string): Promise<void> {
    const existing = await projectModel.findById(id);
    console.log(existing)
    if (!existing) {
      throw new Error("Project not found");
    }

    if (!canEditProject(user, existing)) {
      throw new Error("Not allowed to delete this project");
    }

    await projectModel.delete(id);
  },

  async getProject(user: AuthUser, id: string): Promise<Project> {
    const existing = await projectModel.findById(id);
    if (!existing) {
      throw new Error("Project not found");
    }

    // For now, if someone can see in list, they can also view details,
    // but you can tighten this later if needed.
    return existing;
  },

  async approveProject(user: AuthUser, id: string): Promise<Project> {
    console.log(user.role)
    if (user.role !== "government_officer") {
      throw new Error("Only government officers can approve projects");
    }

    const existing = await projectModel.findById(id);
    if (!existing) {
      throw new Error("Project not found");
    }

    const updated = await projectModel.update(id, {
      approved: true,
      approvedById: user.id,
      approvedAt: new Date().toISOString(),
    });

    if (!updated) {
      throw new Error("Project not found after approval");
    }

    return updated;
  },
};
