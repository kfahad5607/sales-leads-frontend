import { z } from "zod";


export const LEAD_STAGE_NAMES = [
  "lost",
  "new",
  "contacted",
  "qualified",
  "converted",
] as const;

export const LEAD_STAGE_MAP = LEAD_STAGE_NAMES.reduce((acc, stage, index) => {
  acc[stage] = index;
  return acc;
}, {} as Record<(typeof LEAD_STAGE_NAMES)[number], number>);

const LeadBaseSchema = z.object({
  name: z
    .string()
    .max(150, "Name must be 150 characters or less")
    .nonempty("Name is required"),
  email: z
    .string()
    .email("Invalid email format")
    .max(150, "Email must be 150 characters or less")
    .nonempty("Email is required"),
  company_name: z
    .string()
    .max(150, "Company name must be 150 characters or less")
    .nonempty("Company name is required"),
  is_engaged: z.boolean().default(false),
  stage: z.enum(LEAD_STAGE_NAMES),
  last_contacted_at: z
    .string()
    .nullable()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Last contacted date must be a valid datetime",
    }),
});

export const LeadSchema = LeadBaseSchema.extend({
  id: z.number().positive(),
  created_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Created at must be a valid datetime",
  }),
  updated_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Updated at must be a valid datetime",
  }),
});

export const LeadCreateSchema = LeadBaseSchema;
export const LeadCreateWithOptIdSchema = LeadCreateSchema.extend({
  id: z.number().positive().optional(),
});
