import { z } from "zod";

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(3, "Team name must be at least 3 characters long")
    .max(50, "Team name must be less than 50 characters long"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters long")
    .optional(),
});

export const updateTeamSchema = z
  .object({
    name: z
      .string()
      .min(3, "Team name must be at least 3 characters long")
      .max(50, "Team name must be less than 50 characters long")
      .optional(),
    description: z
      .string()
      .max(200, "Description must be less than 200 characters long")
      .optional(),
  })
  .refine(
    (data) => data.name !== undefined || data.description !== undefined,
    "At least one field (name or description) must be provided"
  );

export const teamIdParamSchema = z.object({
  id: z
    .string()
    .uuid("Invalid team ID format"),
});

export type CreateTeamDto = z.infer<typeof createTeamSchema>;
export type UpdateTeamDto = z.infer<typeof updateTeamSchema>;
export type TeamIdParamDto = z.infer<typeof teamIdParamSchema>;
