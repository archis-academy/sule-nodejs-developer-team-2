import { Router } from "express";
import authentication from "../middlewares/authentication";
import {
    validate,
    validateId,
} from "../middlewares/validation";
import {
    createTeamSchema,
    updateTeamSchema,
} from "../dto/team/team";
import teamController from "../controllers/team";

const teamRouter = Router();

teamRouter.post(
    "/",
    authentication,
    validate(createTeamSchema),
    teamController.createTeam
);

teamRouter.get("/", authentication, teamController.getTeams);

teamRouter.get("/:id", authentication, validateId, teamController.getTeamById);

teamRouter.put(
    "/:id",
    authentication,
    validateId,
    validate(updateTeamSchema),
    teamController.updateTeam
);

teamRouter.delete(
    "/:id",
    authentication,
    validateId,
    teamController.deleteTeam
);

export default teamRouter;
