import prisma from '../config/db';
import { CreateTeamDto } from '../dto/team/create.team';
import { UpdateTeamDto } from '../dto/team/update.team';
class TeamModel {
  async createTeam(data: CreateTeamDto, userId: string) {
    return await prisma.team.create({
      data: {
        name: data.name,
        description: data.description,
        createdBy: userId,
        members: {
          create: {
            userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdBy: true,
      },
    });
  }
  async getTeamById(teamId: string, userId: string) {
    return await prisma.team.findFirst({
      where: {
        id: teamId,
        members: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdBy: true,
        members: {
          select: {
            User: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }
  async getTeams(userId: string) {
    return await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdBy: true,
      },
    });
  }
  async updateTeam(teamId: string, data: UpdateTeamDto) {
    return await prisma.team.update({
      where: {
        id: teamId,
      },
      data,
    });
  }
  async deleteTeam(teamId: string) {
    return await prisma.team.delete({
      where: {
        id: teamId,
      },
    });
  }
}

const teamModel = new TeamModel();
export default teamModel;
