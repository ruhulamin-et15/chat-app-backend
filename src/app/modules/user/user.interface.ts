export interface IUser {
  userName: string;
  email?: string;
  phone: string;
  isVerified?: boolean;
  password: string;
  role?: "ADMIN" | "USER" | "TEACHER";
  userStatus?: "ACTIVE" | "BLOCKED" | "DELETED";
}
