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
      height: z.string().optional(),
      chest: z.string().optional(),
      waist: z.string().optional(),
      hips: z.string().optional(),
      shoulder: z.string().optional(),
      wrist: z.string().optional(),
      sleeves: z.string().optional(),
      neck: z.string().optional(),
      lowerBody: z
        .object({
          length: z.string().optional(),
          waist: z.string().optional(),
          inseam: z.string().optional(),
          thigh: z.string().optional(),
          ankle: z.string().optional(),
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
