import prisma from "../config/db";
import { Role } from "@prisma/client";
import { CreateTeamDto, UpdateTeamDto } from "../dto/team/team";

export const createTeam = async (data: CreateTeamDto, userId: string) => {
  const existingTeam = await prisma.team.findFirst({
    where: { name: data.name },
  });

  if (!existingTeam) {
    const team = await prisma.team.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    await prisma.teamMember.create({
      data: {
        userId,
        teamId: team.id,
      },
    });

    return team;
  }
};

export const getTeamsForUser = async (userId: string) => {
  return await prisma.team.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        include: {
          User: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      },
    },
  });
};

export const getTeamById = async (teamId: string, userId: string) => {
  const isMember = await prisma.teamMember.findFirst({
    where: { teamId, userId },
  });

  if (!isMember) return null;
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: {
        include: {
          User: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      },
      expenses: true,
    },
  });

  return team;
};

export const updateTeam = async (
  teamId: string,
  data: UpdateTeamDto,
  userRole: string
) => {
  if (userRole === Role.ADMIN) {
    return prisma.team.update({
      where: { id: teamId },
      data: {
        name: data.name ?? undefined,
        description: data.description ?? undefined,
      },
    });
  }

  return null; 
};

export const deleteTeam = async (teamId: string, userRole: string) => {
  if (userRole === Role.ADMIN) {
    await prisma.$transaction([
      prisma.teamMember.deleteMany({
        where: { teamId },
      }),
      prisma.expense.deleteMany({
        where: { teamId },
      }),
      prisma.team.delete({
        where: { id: teamId },
      }),
    ]);
  }
}
