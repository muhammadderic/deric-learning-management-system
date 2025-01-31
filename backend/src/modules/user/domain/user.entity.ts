export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: "student" | "instructor" | "admin";
  createdAt: Date;
  updatedAt: Date;
}
