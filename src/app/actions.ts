"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const visitorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  idNumber: z.string().min(2, "ID number is required."),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits."),
  purposeOfVisit: z.string().min(2, "Purpose of visit is required."),
  personForVisit: z.string().min(2, "Person for visit is required."),
  organisation: z.string().min(2, "Organisation is required."),
});

export async function addVisitor(prevState: any, formData: FormData) {
  const validatedFields = visitorSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    await addDoc(collection(db, "visitors"), {
      ...validatedFields.data,
      checkInTime: serverTimestamp(),
      checkOutTime: null,
    });
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error adding visitor:", error);
    return { error: "Failed to check in visitor. Please try again." };
  }
}

export async function checkoutVisitor(id: string) {
  try {
    const visitorRef = doc(db, "visitors", id);
    await updateDoc(visitorRef, {
      checkOutTime: serverTimestamp(),
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error checking out visitor:", error);
    return { error: "Failed to check out visitor. Please try again." };
  }
}
