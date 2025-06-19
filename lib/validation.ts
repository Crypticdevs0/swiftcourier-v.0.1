import { z } from "zod"

// Tracking validation
export const trackingNumberSchema = z
  .string()
  .min(6, "Tracking number must be at least 6 characters")
  .max(20, "Tracking number must be less than 20 characters")
  .regex(/^[A-Z0-9]+$/i, "Tracking number must contain only letters and numbers")

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
    .optional(),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must be less than 100 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
})

// Shipping calculation validation
export const shippingCalculationSchema = z.object({
  fromZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
  toZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
  weight: z.number().min(0.1, "Weight must be at least 0.1 lbs").max(150, "Weight cannot exceed 150 lbs"),
  dimensions: z.object({
    length: z.number().min(1, "Length must be at least 1 inch"),
    width: z.number().min(1, "Width must be at least 1 inch"),
    height: z.number().min(1, "Height must be at least 1 inch"),
  }),
  serviceType: z.enum(["standard", "express", "overnight"], {
    errorMap: () => ({ message: "Please select a valid service type" }),
  }),
})

// Login validation
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

// Registration validation
export const registrationSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export type TrackingNumberInput = z.infer<typeof trackingNumberSchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>
export type ShippingCalculationInput = z.infer<typeof shippingCalculationSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RegistrationInput = z.infer<typeof registrationSchema>
