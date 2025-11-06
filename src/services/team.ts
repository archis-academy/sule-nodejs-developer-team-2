import { Prisma } from "@prisma/client";
import { CreateTeamDto, UpdateTeamDto } from "../dto/team/team";
import * as teamModel from "../models/team";
import { AppError } from "../utils/appError";

class TeamService {
  async createTeam(data: CreateTeamDto, userId: string) {
    try {
      const team = await teamModel.createTeam(data, userId);
      return team;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002": // Unique constraint failed
            throw new AppError("A team with this name already exists.", 409);
          case "P2003": // Foreign key constraint failed
            throw new AppError("Invalid user or team relation.", 400);
          case "P2025": // Record not found
            throw new AppError("Team not found.", 404);
          default:
            throw new AppError(`Database error: ${error.code}`, 500);
        }
      }

      // Prisma dışı hatalar için
      if (error instanceof Error) {
        // Geliştiriciye log atılabilir (opsiyonel)
        console.error("[createTeam Error]:", error);
        throw new AppError(error.message, 500);
      }

      throw new AppError("Failed to create team.", 500);
    }
  }

  async getTeams(userId: string) {
    try {
      return await teamModel.getTeamsForUser(userId);
    } catch (error: unknown) {
      console.error("[getTeams Error]:", error);
      throw new AppError("Failed to fetch teams.", 500);
    }
  }

  async getTeamById(teamId: string, userId: string) {
    try {
      const team = await teamModel.getTeamById(teamId, userId);
      if (!team) throw new AppError("Team not found.", 404);
      return team;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new AppError("Team not found.", 404);
      }
      if (error instanceof Error) {
        console.error("[getTeamById Error]:", error);
        throw new AppError(error.message, 404);
      }
      throw new AppError("Failed to fetch team details.", 500);
    }
  }

  async updateTeam(teamId: string, userRole: string, data: UpdateTeamDto) {
    try {
      const team = await teamModel.updateTeam(teamId, data, userRole);
      return team;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2025":
            throw new AppError("Team not found.", 404);
          default:
            throw new AppError(`Database error: ${error.code}`, 500);
        }
      }
      if (error instanceof Error) {
        console.error("[updateTeam Error]:", error);
        throw new AppError(error.message, 400);
      }
      throw new AppError("Failed to update team.", 500);
    }
  }

  async deleteTeam(teamId: string, userRole: string) {
    try {
      await teamModel.deleteTeam(teamId, userRole);
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2025":
            throw new AppError("Team not found.", 404);
          case "P2003":
            throw new AppError("Cannot delete team with active relations.", 400);
          default:
            throw new AppError(`Database error: ${error.code}`, 500);
        }
      }
      if (error instanceof Error) {
        console.error("[deleteTeam Error]:", error);
        throw new AppError(error.message, 400);
      }
      throw new AppError("Failed to delete team.", 500);
    }
  }
}

const teamService = new TeamService();
export default teamService;
