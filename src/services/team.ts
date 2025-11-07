import { CreateTeamDto } from '../dto/team/create.team';
import { UpdateTeamDto } from '../dto/team/update.team';
import teamModel from '../models/team';
import { AppError } from '../utils/appError';

class TeamService {
  private async checkTeamName(teamName: string) {
    const existingTeam = await teamModel.getTeamByName(teamName);
    if (existingTeam) {
      throw new AppError('A team with this name already exists.', 409);
    }
  }
  private async checkTeam(id: string) {
    const team = await teamModel.getTeamById(id);
    if (!team) {
      throw new AppError('Team not found.', 404);
    }
    return team;
  }
  async createTeam(data: CreateTeamDto, userId: string) {
    await this.checkTeamName(data.name);
    const team = await teamModel.createTeam(data, userId);
    return team;
  }
  async getTeamById(teamId: string, userId: string) {
    const team = await teamModel.getTeamByIdWithMembershipCheck(teamId, userId);
    if (!team) throw new AppError('Team not found.', 404);
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
      await teamModel.deleteTeam(teamId);
      return 'Team deleted successfully.';
    } catch (error) {
      console.error(error);
      throw new AppError('An error occurred while deleting the team.', 500);
    }
  }
}

const teamService = new TeamService();
export default teamService;
