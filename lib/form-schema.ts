import { isAfter } from "date-fns";
import { z } from "zod";

export const ElectionSchema = z
  .object({
    electionType: z.string().min(1, {
      message: "Election type is required.",
    }),
    votingType: z.enum(["single", "multiple"], {
      required_error: "Voting type is required.",
    }),
    numberOfVotes: z
      .number()
      .min(1, {
        message: "Number of votes must be at least 1.",
      })
      .max(30),
    startDate: z.string().min(1, {
      message: "Election start date is required.",
    }),
    endDate: z.string().min(1, {
      message: "Election end date is required.",
    }),
    description: z.string().optional(),
    candidates: z.string().array().min(1, {
      message: "At least one candidate is required.",
    }),
    status: z.enum(["active", "inactive"], {
      required_error: "Status is required.",
    }),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      // Ensure endDate is after startDate
      return isAfter(endDate, startDate);
    },
    {
      message: "The end date must be after the start date.",
      path: ["endDate"], // Show error on the endDate field
    }
  );

// Utility function to validate image data URL
const validateImageFile = (file: File) => {
  const allowedExtensions = ["jpg", "jpeg", "png"];
  const extension = file.name.split(".").pop()?.toLowerCase();
  console.log("validateImageFile", file);
  return allowedExtensions.includes(extension || "");
};

export type SocialLinkType = "facebook" | "instagram" | "x" | "custom";
export type SocialLink = {
  type: SocialLinkType;
  url: string;
};

// Helper schema for SocialLinks
const SocialLinksSchema = z.object({
  type: z.enum(["facebook", "x", "instagram", "custom"]),
  url: z.string().url("Invalid URL format"),
});

export const CandidateSchema = z.object({
  // id: z.string(),
  displayName: z.string().min(1, "Name is required"),
  party: z.string().min(1, "Party is required"),
  displayPhoto: z.any().refine(
    (file) => {
      // Skip validation if the file is undefined (no new file uploaded)
      if (!(file === undefined || file === null)) {
        return true;
      }
      // Validate the file if it exists
      return file instanceof File && validateImageFile(file);
    },
    {
      message: "Invalid image file. Only JPG, JPEG, PNG formats allowed.",
    }
  ),
  coverPhoto: z
    .any()
    .refine(
      (file) => {
        // Skip validation if the file is undefined (no new file uploaded)
        if (!(file === undefined || file === null)) {
          return true;
        }
        // Validate the file if it exists
        return file instanceof File && validateImageFile(file);
      },
      {
        message: "Invalid image file. Only JPG, JPEG, PNG formats allowed.",
      }
    )
    .optional(),
  shortDescription: z.string(),
  balotNumber: z.coerce
    .number()
    .positive("Balot number must be a positive integer"),
  // Fields that accept markdown content, including newlines
  biography: z.string(),
  educAttainment: z.string().optional(),
  achievements: z.string().optional(),
  platformAndPolicy: z.string().optional(),
  socialLinks: z.array(SocialLinksSchema).optional(),
});
