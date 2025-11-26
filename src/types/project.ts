// src/types/project.ts

// very simplified GeoJSON geometry type
export type GeoJSONGeometry = {
  type:
    | "Point"
    | "LineString"
    | "Polygon"
    | "MultiPoint"
    | "MultiLineString"
    | "MultiPolygon";
  coordinates: any; // you can tighten this later
};

export type UtilityType =
  | "Sewage"
  | "Water pipeline"
  | "Electric Line"
  | "Fiber Optic"
  | "LPG Line";

export type ProjectStatus = "planning" | "active" | "completed" | "pending";

export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;          // user.id of creator (contractor/gov)
  status: ProjectStatus;
  geometry?: GeoJSONGeometry;
  startDate?: string;   // ISO date string
  endDate?: string;     // ISO date string

  approved: boolean;        // has government approved it?
  approvedById?: string;    // gov user id
  approvedAt?: string;      // ISO date string
  utilityType: UtilityType; // 👈 NEW: which layer this belongs to
}

export interface CreateProjectBody {
  name: string;
  description?: string;
  status?: ProjectStatus;
  geometry?: GeoJSONGeometry;
  startDate?: string;   // ISO date string
  endDate?: string;     // ISO date string
  utilityType: UtilityType; // 👈 NEW: which layer this belongs to
}

export interface UpdateProjectBody {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  geometry?: GeoJSONGeometry;
  startDate?: string;   // ISO date string
  endDate?: string;     // ISO date string
  utilityType?: UtilityType; // 👈 NEW: which layer this belongs to
}
