import { z } from "zod"

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export const registrationSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    terms: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
    marketing: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// Shipping schemas
export const addressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
  country: z.string().default("US"),
})

export const packageSchema = z.object({
  weight: z.number().min(0.1, "Weight must be at least 0.1 lbs").max(150, "Weight cannot exceed 150 lbs"),
  dimensions: z.object({
    length: z.number().min(1, "Length must be at least 1 inch").max(108, "Length cannot exceed 108 inches"),
    width: z.number().min(1, "Width must be at least 1 inch").max(108, "Width cannot exceed 108 inches"),
    height: z.number().min(1, "Height must be at least 1 inch").max(108, "Height cannot exceed 108 inches"),
  }),
  service: z.enum(["swift_express", "swift_standard", "swift_overnight", "swift_ground"]),
  insurance: z.number().min(0).max(5000).optional(),
  signature: z.boolean().optional(),
})

export const shipmentSchema = z.object({
  sender: addressSchema,
  recipient: addressSchema,
  package: packageSchema,
  service: z.string(),
  specialInstructions: z.string().optional(),
})

// Tracking schema
export const trackingSchema = z.object({
  trackingNumber: z.string().regex(/^SC\d{6}[A-Z0-9]{6}$/, "Invalid tracking number format"),
})

// Types
export type LoginInput = z.infer<typeof loginSchema>
export type RegistrationInput = z.infer<typeof registrationSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type PackageInput = z.infer<typeof packageSchema>
export type ShipmentInput = z.infer<typeof shipmentSchema>
export type TrackingInput = z.infer<typeof trackingSchema>
