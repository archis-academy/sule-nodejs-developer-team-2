import prisma from "../config/db";
import { Role } from "@prisma/client";
import { CreateTeamDto, UpdateTeamDto } from "../dto/team/team";

export const createTeam = async (data: CreateTeamDto, userId: string) => {
  return await prisma.$transaction(async (tx) => {
    const existingTeam = await tx.team.findFirst({
      where: { name: data.name },
    });

    if (existingTeam) {
      throw new Error("A team with this name already exists.");
    }

    const team = await tx.team.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    await tx.teamMember.create({
      data: {
        userId: userId,
        teamId: team.id,
      },
    });

    return team;
  });
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

  if (!team) {
    throw new Error("Team not found.");
  }

  const isMember = team.members.some((member) => member.userId === userId);
  if (!isMember) {
    throw new Error("You are not authorized to view this team.");
  }

  return team;
};

export const updateTeam = async (
  teamId: string,
  data: UpdateTeamDto,
  userRole: string
) => {
  if (userRole !== Role.ADMIN) {
    throw new Error("Only admins can update team information.");
  }

  const existingTeam = await prisma.team.findUnique({
    where: { id: teamId },
  });

  if (!existingTeam) {
    throw new Error("Team not found.");
  }

  return await prisma.team.update({
    where: { id: teamId },
    data: {
      name: data.name ?? existingTeam.name,
      description: data.description ?? existingTeam.description,
    },
  });
};

export const deleteTeam = async (teamId: string, userRole: string) => {
  if (userRole !== Role.ADMIN) {
    throw new Error("Only admins can delete teams.");
  }

  return await prisma.$transaction(async (tx) => {
    const team = await tx.team.findUnique({
      where: { id: teamId },
      include: { members: true, expenses: true },
    });

    if (!team) {
      throw new Error("Team not found.");
    }

    await tx.team.delete({ where: { id: teamId } });

    return { message: "Team and related data deleted successfully." };
  });
};
