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
        if (error.code === "P2002") {
          throw new AppError("A team with this name already exists.", 409);
        }
      }

      if (error instanceof Error) {
        throw new AppError(error.message, 500);
      }

      throw new AppError("Failed to create team.", 500);
    }
  }

  async getTeams(userId: string) {
    try {
      return await teamModel.getTeamsForUser(userId);
    } catch {
      throw new AppError("Failed to fetch teams.", 500);
    }
  }

  async getTeamById(teamId: string, userId: string) {
    try {
      return await teamModel.getTeamById(teamId, userId);
    } catch (error: unknown) {
      if (error instanceof Error) throw new AppError(error.message, 404);
      throw new AppError("Failed to fetch team details.", 500);
    }
  }

  async updateTeam(teamId: string, userRole: string, data: UpdateTeamDto) {
    try {
      return await teamModel.updateTeam(teamId, data, userRole);
    } catch (error: unknown) {
      if (error instanceof Error) throw new AppError(error.message, 400);
      throw new AppError("Failed to update team.", 500);
    }
  }

  async deleteTeam(teamId: string, userRole: string) {
    try {
      await teamModel.deleteTeam(teamId, userRole);
    } catch (error: unknown) {
      if (error instanceof Error) throw new AppError(error.message, 400);
      throw new AppError("Failed to delete team.", 500);
    }
  }
}

const teamService = new TeamService();
export default teamService;
