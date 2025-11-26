// src/routes/project.routes.ts
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { projectService } from "../services/project.service";
import { CreateProjectBody, UpdateProjectBody } from "../types/project";
import { AuthUser } from "../types/user";

const projectRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
   // ensure JWT for all project operations
  fastify.addHook("preHandler", fastify.authenticate);

  // GET /projects - list all (all roles can view)
  fastify.get("/projects", async (request, reply) => {
    const user = request.user as any as AuthUser;
    const projects = await projectService.listProjects(user);
    return reply.send({ projects });
  });

  // POST /projects - gov + contractor, citizen no
  fastify.post<{ Body: CreateProjectBody }>("/projects", async (request, reply) => {
    const user = request.user as any as AuthUser;
    try {
      const project = await projectService.createProject(user, request.body);
      return reply.status(201).send({ project });
    } catch (err: any) {
      return reply
        .status(403)
        .send({ message: err.message ?? "Not allowed to create project" });
    }
  });

  // GET /projects/:id - view details
  fastify.get<{ Params: { id: string } }>("/projects/:id", async (request, reply) => {
    const user = request.user as any as AuthUser;
    const { id } = request.params;
    try {
      const project = await projectService.getProject(user, id);
      return reply.send({ project });
    } catch (err: any) {
      return reply
        .status(404)
        .send({ message: err.message ?? "Project not found" });
    }
  });

  // PUT /projects/:id - gov or owning contractor
  fastify.put<{ Params: { id: string }; Body: UpdateProjectBody }>(
    "/projects/:id",
    async (request, reply) => {
      const user = request.user as any as AuthUser;
      const { id } = request.params;

      try {
        const project = await projectService.updateProject(user, id, request.body);
        return reply.send({ project });
      } catch (err: any) {
        const msg = err.message ?? "Failed to update project";
        const status = msg.includes("Not allowed") ? 403 : 404;
        return reply.status(status).send({ message: msg });
      }
    }
  );

  // DELETE /projects/:id - gov or owning contractor
  fastify.delete<{ Params: { id: string } }>(
    "/projects/:id",
    async (request, reply) => {
      const user = request.user as any as AuthUser;
      const { id } = request.params;

      try {
        await projectService.deleteProject(user, id);
        return reply.status(204).send();
      } catch (err: any) {
        const msg = err.message ?? "Failed to delete project";
        const status = msg.includes("Not allowed") ? 403 : 404;
        return reply.status(status).send({ message: msg });
      }
    }
  );

  // PATCH /projects/:id/approve - government only
  fastify.patch<{ Params: { id: string } }>(
    "/projects/:id/approve",
    async (request, reply) => {
      const user = request.user as any as AuthUser;
      console.log(user)
      const { id } = request.params;
      try {
        const project = await projectService.approveProject(user, id);
        return reply.send({ project });
      } catch (err: any) {
        const msg = err.message ?? "Failed to approve project";
        const status = msg.includes("Only government") ? 403 : 404;
        return reply.status(status).send({ message: msg });
      }
    }
  );
};

export default projectRoutes;
