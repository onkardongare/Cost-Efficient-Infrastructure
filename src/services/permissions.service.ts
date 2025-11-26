// src/services/permissions.service.ts
import { AuthUser } from "../types/user";
import { Project } from "../types/project";

export function isGovernment(user: AuthUser | null | undefined): boolean {
  return user?.role === "government_officer";
}

export function isContractor(user: AuthUser | null | undefined): boolean {
  return user?.role === "contractor";
}

export function isCitizen(user: AuthUser | null | undefined): boolean {
  return user?.role === "citizen";
}

// Government: everything
export function canManageAllProjects(user: AuthUser | null | undefined): boolean {
  return isGovernment(user);
}

// Contractor: can edit only own project
export function canEditProject(
  user: AuthUser | null | undefined,
  project: Project
): boolean {
  if (!user) return false;
  if (isGovernment(user)) return true;
  if (isContractor(user) && project.ownerId === user.id) return true;
  return false;
}

// Everyone (logged-in) can view projects/map
export function canViewProject(
  user: AuthUser | null | undefined,
  project: Project
): boolean {
  // you can customize later (e.g., hide some from citizens)
  return !!user; // any authenticated user
}
