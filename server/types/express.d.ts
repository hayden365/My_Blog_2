import { Request, User } from "express";

declare module "express" {
  interface Request {
    currentUserId?: string;
  }

  interface User {
    id: string;
  }
}
