"use server";

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
  const validatedFields = visitorSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  revalidatePath("/");
  return { success: true, data: validatedFields.data };
}

export async function checkoutVisitor(id: string) {
  revalidatePath("/");
  return { success: true };
}
