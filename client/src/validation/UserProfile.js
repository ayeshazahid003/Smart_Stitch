import { z } from "zod";

const AddressSchema = z.object({
  line1: z.string().optional(),
  line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

const MeasurementSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  data: z
    .object({
      height: z.number().optional(),
      chest: z.number().optional(),
      waist: z.number().optional(),
      hips: z.number().optional(),
      shoulder: z.number().optional(),
      wrist: z.number().optional(),
      sleeves: z.number().optional(),
      neck: z.number().optional(),
      lowerBody: z
        .object({
          length: z.number().optional(),
          waist: z.number().optional(),
          inseam: z.number().optional(),
          thigh: z.number().optional(),
          ankle: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
});

export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(["customer", "tailor"], {
    errorMap: () => ({ message: "Role must be either 'customer' or 'tailor'" }),
  }),
  contactInfo: z
    .object({
      phone: z.string().optional(),
      address: AddressSchema.optional(),
    })
    .optional(),
  measurements: z.array(MeasurementSchema).optional(),
});
