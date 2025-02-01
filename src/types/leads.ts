import { z } from "zod";
import { LeadCreate, Lead } from "../schemas/leads";

export type LeadCreate = z.infer<typeof LeadCreate>;
export type Lead = z.infer<typeof Lead>;
