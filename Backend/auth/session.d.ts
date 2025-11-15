declare module "express-session" {
  interface SessionData {
    userId?: number;
    userEmail?: string;
  }
}
