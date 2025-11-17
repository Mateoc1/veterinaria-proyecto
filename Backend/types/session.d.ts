import "express-session";
import type { SessionData } from "express-session";

declare module "express-session" {
  interface SessionData {
    idusuario?: string | number;
    userId?: string | number;
    userEmail?: string;
  }
}
