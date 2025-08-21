import "server-only";
import { UserRole } from "@prisma/client";

export interface User {
  id: string;
  authId: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRepository {
  create(data: {
    authId: string;
    email: string;
    role?: UserRole;
  }): Promise<User>;
  findByAuthId(authId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  updateRole(authId: string, role: UserRole): Promise<User>;
  delete(authId: string): Promise<void>;
}
