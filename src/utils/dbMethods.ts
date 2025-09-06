import { prisma } from "../lib/prisma";
import type { User as PrismaUser } from "@prisma/client";

export type User = PrismaUser;

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    return user ?? null;
  } catch (err) {
    console.error("Error getting user by email", err);
    return null;
  }
};
export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findFirst({ where: { id } });
    return user ?? null;
  } catch (err) {
    console.error("Error getting user by email", err);
    return null;
  }
};

// If password is provided, verifies it against stored hash and returns the user on success
export const getUserFromDb = async (email: string) => {
  try {
    const user = await getUserByEmail(email);
    return user ?? null;
  } catch (err) {
    console.error("Error verifying user from db", err);
    return null;
  }
};

export const createUser = async (payload: {
  id: string;
  team_leader_name: string;
  organisation: string;
  company_number: string;
  email: string;
}) => {
  try {
    const created = await prisma.user.create({
      data: {
        id: payload.id,
        teamLeaderName: payload.team_leader_name,
        organisation: payload.organisation,
        companyNumber: payload.company_number,
        email: payload.email,
      },
    });

    return created;
  } catch (err) {
    console.error("Error creating user", err);
    throw err;
  }
};

// Visitor helpers
export type Visitor = {
  id?: string;
  name: string;
  idNumber: string;
  phoneNumber: string;
  purposeOfVisit: string;
  personForVisit: string;
  organisation?: string | null;
  hostId?: string | null;
  checkedInAt?: Date;
  checkedOutAt?: Date | null;
};

export const createVisitor = async (payload: Visitor) => {
  try {
    const created = await prisma.visitor.create({
      data: {
        name: payload.name,
        idNumber: payload.idNumber,
        phoneNumber: payload.phoneNumber,
        purposeOfVisit: payload.purposeOfVisit,
        personForVisit: payload.personForVisit,
        organisation: payload.organisation ?? null,
        hostId: payload.hostId ?? null,
      },
    });
    return created;
  } catch (err) {
    console.error("Error creating visitor", err);
    throw err;
  }
};

export const checkoutVisitorById = async (id: string) => {
  try {
    const updated = await prisma.visitor.update({
      where: { id },
      data: { checkedOutAt: new Date() },
    });
    return updated;
  } catch (err) {
    console.error("Error checking out visitor", err);
    return null;
  }
};

export const getVisitorById = async (id: string) => {
  try {
    const visitor = await prisma.visitor.findUnique({ where: { id } });
    return visitor ?? null;
  } catch (err) {
    console.error("Error getting visitor by id", err);
    return null;
  }
};

export const listRecentVisitors = async (limit = 50) => {
  try {
    const list = await prisma.visitor.findMany({
      orderBy: { checkedInAt: "desc" },
      take: limit,
    });
    return list;
  } catch (err) {
    console.error("Error listing visitors", err);
    return [];
  }
};

// Update user record (partial update)
export const updateUser = async (
  id: string,
  data: Partial<{
    teamLeaderName: string;
    organisation: string;
    companyNumber: string;
  }>
) => {
  try {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        teamLeaderName: data.teamLeaderName,
        organisation: data.organisation,
        companyNumber: data.companyNumber,
      },
    });
    return updated;
  } catch (err) {
    console.error("Error updating user", err);
    return null;
  }
};
