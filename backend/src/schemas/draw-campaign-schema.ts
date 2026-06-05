import { z } from "zod";

export const createDrawCampaignSchema = z.object({
  name: z.string().min(1, "Draw name is required"),
  prizeName: z.string().min(1, "Prize name is required"),
  // prizeImage is validated in controller to check for uploaded file
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)),
  winnerCount: z.preprocess((val) => Number(val), z.number().int().positive("Winner count must be positive")),
  status: z.enum(["DRAFT", "ACTIVE", "COMPLETED"]).optional().default("DRAFT"),
});

export const updateDrawCampaignSchema = z.object({
  name: z.string().min(1).optional(),
  prizeName: z.string().min(1).optional(),
  startDate: z.string().transform((val) => new Date(val)).optional(),
  endDate: z.string().transform((val) => new Date(val)).optional(),
  winnerCount: z.preprocess((val) => Number(val), z.number().int().positive()).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "COMPLETED"]).optional(),
});
