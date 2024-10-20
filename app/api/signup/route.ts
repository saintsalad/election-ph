import { NextResponse } from "next/server";
import { auth, db } from "@/lib/firebase/firebase-admin";
import { z } from "zod";

// Validation functions
const isValidUsername = (str: string) => /^(?!.*[_.]{3})[\w.]*$/.test(str);

const isValidPassword = (str: string) =>
  /[a-zA-Z]/.test(str) && /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str);

// Update the schema to include an optional userId
const signupSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters.")
    .max(16, "Username has maximum of 16 characters.")
    .refine((data) => isValidUsername(data), {
      message:
        "The username is invalid. Please use only letters, numbers, dots, and underscores.",
    })
    .optional(),
  email: z.string().email("Invalid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long.")
    .refine((data) => isValidPassword(data), {
      message: "Password does not meet the requirements. Please try again.",
    })
    .optional(),
  userId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let body = {};
    if (!userId) {
      // Only parse the body for non-Google signups
      body = await request.json();
    }

    if (userId) {
      // Google signup
      try {
        const userRecord = await auth.getUser(userId);
        const email = userRecord.email;
        if (!email) {
          throw new Error("User email not found");
        }

        // Check if email already exists
        const emailQuery = await db
          .collection("users")
          .where("email", "==", email)
          .get();

        if (!emailQuery.empty) {
          // Delete the authentication account if email already exists
          return NextResponse.json(
            { code: "EMAIL_EXISTS", details: "Email already exists" },
            { status: 400 }
          );
        }

        const generatedUsername = email.split("@")[0];

        // Check if username already exists
        const usernameQuery = await db
          .collection("users")
          .where("username", "==", generatedUsername)
          .get();

        if (!usernameQuery.empty) {
          // Delete the authentication account if username already exists
          await auth.deleteUser(userId);
          return NextResponse.json(
            { code: "USERNAME_EXISTS", details: "Username already exists" },
            { status: 400 }
          );
        }

        // Save user data to Firestore
        try {
          await db.collection("users").doc(userId).set({
            email,
            username: generatedUsername,
            createdAt: new Date().toISOString(),
          });
        } catch (error) {
          // If Firestore save fails, delete the authentication account
          await auth.deleteUser(userId);
          throw error;
        }

        return NextResponse.json({
          code: "SIGNUP_SUCCESS",
          userId: userId,
        });
      } catch (error) {
        if (error instanceof Error) {
          return NextResponse.json(
            { code: "AUTH_FAILED", details: error.message },
            { status: 400 }
          );
        }
        throw error;
      }
    } else {
      // Regular signup
      // Validate input
      const result = signupSchema.safeParse(body);
      if (!result.success) {
        const errors = result.error.errors.map(
          (error) => `${error.path}: ${error.message}`
        );
        return NextResponse.json(
          { code: "VALIDATION_FAILED", details: errors },
          { status: 400 }
        );
      }

      const { email, password, username } = result.data;

      // Check if username already exists
      const usernameQuery = await db
        .collection("users")
        .where("username", "==", username)
        .get();
      if (!usernameQuery.empty) {
        return NextResponse.json(
          { code: "USERNAME_EXISTS", details: "Username already exists" },
          { status: 400 }
        );
      }

      // Create user with email and password
      let userRecord;
      try {
        userRecord = await auth.createUser({
          email,
          password,
          displayName: username,
        });
      } catch (error) {
        if (error instanceof Error) {
          return NextResponse.json(
            { code: "AUTH_FAILED", details: error.message },
            { status: 400 }
          );
        }
        throw error;
      }

      // If user creation was successful, save additional data to Firestore
      try {
        await db.collection("users").doc(userRecord.uid).set({
          email,
          username,
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        // If Firestore save fails, delete the created user to maintain consistency
        await auth.deleteUser(userRecord.uid);
        throw error;
      }

      return NextResponse.json({
        code: "SIGNUP_SUCCESS",
        userId: userRecord.uid,
      });
    }
  } catch (error) {
    console.error("Error in signup:", error);
    return NextResponse.json(
      { code: "INTERNAL_ERROR", details: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
