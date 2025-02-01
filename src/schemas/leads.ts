import { z } from "zod";

const LeadBase = z.object({
  name: z
    .string()
    .max(100, "Name must be 100 characters or less")
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
  engaged: z.boolean().default(false),
  last_contacted_at: z
    .string()
    .nullable()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Last contacted date must be a valid datetime",
    }),
});

export const Lead = LeadBase.extend({
  id: z.string().uuid("Invalid UUID format"),
  created_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Created at must be a valid datetime",
  }),
  updated_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Updated at must be a valid datetime",
  }),
});

export const LeadCreate = LeadBase;
