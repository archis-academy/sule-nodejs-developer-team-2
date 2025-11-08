import { CreateTeamDto } from '../dto/team/create.team';
import { UpdateTeamDto } from '../dto/team/update.team';
import teamModel from '../models/team';
import { AppError } from '../utils/appError';
import { Prisma } from '@prisma/client';
import prisma from '../config/db';
class TeamService {
  private async checkTeamName(teamName: string) {
    const existingTeam = await teamModel.getTeamByName(teamName);
    if (existingTeam) {
      throw new AppError('A team with this name already exists.', 409);
    }
  }
  async checkTeam(id: string, tx?: Prisma.TransactionClient) {
    const team = await teamModel.getTeamById(id, tx);
    if (!team) {
      throw new AppError('Team not found.', 404);
    }
    return team;
  }
  private async checkMembership(
    teamId: string,
    userId: string,
    tx?: Prisma.TransactionClient
  ) {
    const isMember = await teamModel.checkMembership(teamId, userId, tx);
    return isMember;
  }
  async createTeam(data: CreateTeamDto, userId: string) {
    await this.checkTeamName(data.name);
    const team = await teamModel.createTeam(data, userId);
    return team;
  }
  async getTeamById(teamId: string, userId: string) {
    const team = await teamModel.getTeamByIdWithMembershipCheck(teamId, userId);
    if (!team || team.members.length === 0) {
      throw new AppError('Team not found.', 404);
    }
    return team;
  }
  async getTeams(userId: string) {
    const teams = await teamModel.getTeams(userId);
    return teams;
  }
  async updateTeam(teamId: string, data: UpdateTeamDto) {
    await this.checkTeam(teamId);
    if (data.name) {
      await this.checkTeamName(data.name);
    }
    const updatedTeam = await teamModel.updateTeam(teamId, data);
    return updatedTeam;
  }
  async deleteTeam(teamId: string) {
    await this.checkTeam(teamId);
    try {
      return await teamModel.deleteTeam(teamId);
    } catch (error) {
      console.error(error);
      throw new AppError('An error occurred while deleting the team.', 500);
    }
  }
  async addMember(teamId: string, userId: string) {
    await prisma.$transaction(async (tx) => {
      await this.checkTeam(teamId, tx);
      const isMember = await this.checkMembership(teamId, userId, tx);
      if (isMember) {
        throw new AppError('User is already a member of this team.', 409);
      }
      return await teamModel.addMember(teamId, userId, tx);
    });
  }
  async getTeamMembers(teamId: string) {
    await this.checkTeam(teamId);
    return await teamModel.getTeamMembers(teamId);
  }
  async removeMember(teamId: string, userId: string) {
    await prisma.$transaction(async (tx) => {
      await this.checkTeam(teamId, tx);
      const isMember = await this.checkMembership(teamId, userId, tx);
      if (!isMember) {
        throw new AppError('User is not a member of this team.', 403);
      }
      return await teamModel.removeMember(teamId, userId, tx);
    });
  }
}

const teamService = new TeamService();
export default teamService;
