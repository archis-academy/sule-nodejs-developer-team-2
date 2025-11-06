import { Request, Response } from "express";
import { AppError } from "../utils/appError";
import teamService from "../services/team";
import { CreateTeamDto, UpdateTeamDto } from "../dto/team/team";
import { JwtPayload } from "../types/express"; 

class TeamController {
  async createTeam(
    req: Request<Record<string, never>, Record<string, never>, CreateTeamDto>,
    res: Response
  ) {
    try {
      const user = req.user as JwtPayload; 
      const { name, description } = req.body;

      const team = await teamService.createTeam({ name, description }, user.userId);
      res.status(201).json(team);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  async getTeams(req: Request, res: Response) {
    try {
      const user = req.user as JwtPayload;
      const teams = await teamService.getTeams(user.userId);
      res.status(200).json(teams);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  async getTeamById(req: Request<{ id: string }>, res: Response) {
    try {
      const user = req.user as JwtPayload;
      const { id } = req.params;

      const team = await teamService.getTeamById(id, user.userId);
      res.status(200).json(team);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  async updateTeam(
    req: Request<{ id: string }, Record<string, never>, UpdateTeamDto>,
    res: Response
  ) {
    try {
      const user = req.user as JwtPayload;
      const { id } = req.params;
      const { name, description } = req.body;

      const team = await teamService.updateTeam(id, user.role, { name, description });
      res.status(200).json(team);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  async deleteTeam(req: Request<{ id: string }>, res: Response) {
    try {
      const user = req.user as JwtPayload;
      const { id } = req.params;

      await teamService.deleteTeam(id, user.role);
      res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
}

const teamController = new TeamController();
export default teamController;
