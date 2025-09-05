"use server";
//Onboarding redirect method
import {
  getUserById,
  createVisitor,
  checkoutVisitorById,
} from "@/utils/dbMethods";
import type { Visitor as VisitorType } from "@/utils/dbMethods";
import { currentUser, User } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

const visitorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  idNumber: z.string().min(2, "ID number is required."),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits."),
  purposeOfVisit: z.string().min(2, "Purpose of visit is required."),
  personForVisit: z.string().min(2, "Person for visit is required."),
  organisation: z.string().min(2, "Organisation is required."),
});

// Note: These actions will not work as expected because they are server actions
// and localStorage is not available on the server.
// The logic has been moved to the client-side components.
// These are kept for compatibility with the form action.

export async function addVisitor(prevState: any, formData: FormData) {
  const validatedFields = visitorSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const payload: VisitorType = {
      name: validatedFields.data.name,
      idNumber: validatedFields.data.idNumber,
      phoneNumber: validatedFields.data.phoneNumber,
      purposeOfVisit: validatedFields.data.purposeOfVisit,
      personForVisit: validatedFields.data.personForVisit,
      organisation: validatedFields.data.organisation,
    };

    const created = await createVisitor(payload);
    revalidatePath("/");
    return { success: true, data: created };
  } catch (error) {
    console.error("Error adding visitor", error);
    return { error: "DB_ERROR" };
  }
}

export async function checkoutVisitor(id: string) {
  try {
    const updated = await checkoutVisitorById(id);
    revalidatePath("/");
    if (!updated) return { error: "NOT_FOUND" };
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error checking out visitor", error);
    return { error: "DB_ERROR" };
  }
}

export async function getOrgName() {
  try {
    const authUser = await currentUser();
    if (!authUser) return null;
    const dbUser = await getUserById(authUser.id as string);
    return dbUser?.organisation;
  } catch (error) {
    console.log("Error getting company name", error);
  }
}
