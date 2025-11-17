import "express-session";
import type { SessionData } from "express-session";

declare global {
  namespace Express {
    interface Session {
      idusuario?: string | number;
      userId?: string | number;
      userEmail?: string;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    idusuario?: string | number;
    userId?: string | number;
    userEmail?: string;
  }
}

export {};
