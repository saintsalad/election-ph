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

export const CandidateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  party: z.string().min(1, "Party is required"),
  image: z.any().refine(
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
  shortDescription: z.string().optional(),
  description: z.string().optional(),
});
