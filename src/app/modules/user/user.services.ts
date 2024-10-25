import { PrismaClient, User } from "@prisma/client";
import { IUser } from "./user.interface";
import ApiError from "../../errors/ApiErrors";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

const createUserIntoDB = async (payload: User) => {
  const existingUser = await prisma.user.findFirst({
    where: { email: payload.email },
  });

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  if (existingUser) {
    throw new ApiError(409, "user with this email/phone already exist!");
  }
  // Create a new user in the database
  const newUser = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
  });

  return newUser;
};

const getUsersIntoDB = async () => {
  try {
    const users = await prisma.user.findMany();
    if (users.length === 0) {
      throw new ApiError(404, "Users not found!"); // Correctly throwing the error
    }
    return users;
  } catch (error) {
    throw error; // Re-throwing the error to be caught by the route controller
  }
};

const getSingleUserIntoDB = async (id: string) => {
  try {
    // Validate the ID format as a MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user ID format");
    }
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError(404, "user not found!");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

const updateUserIntoDB = async (id: string, userData: any) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user ID format");
    }
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new ApiError(404, "user not found for edit user");
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

const deleteUserIntoDB = async (id: string) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user ID format");
    }
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new ApiError(404, "user not found for delete this");
    }
    const deletedUser = await prisma.user.delete({
      where: { id },
    });
    return deletedUser;
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createUserIntoDB,
  getUsersIntoDB,
  getSingleUserIntoDB,
  updateUserIntoDB,
  deleteUserIntoDB,
};
