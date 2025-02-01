import { z } from "zod";
import {
  LeadCreateSchema,
  LeadSchema,
  LeadCreateWithOptIdSchema,
} from "../schemas/leads";

export type LeadCreateWithOptId = z.infer<typeof LeadCreateWithOptIdSchema>;
export type LeadCreate = z.infer<typeof LeadCreateSchema>;
export type Lead = z.infer<typeof LeadSchema>;
