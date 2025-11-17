import express from "express";

declare module "express-session" {
  interface SessionData {
    userId?: number;
    userEmail?: string;
    userRole?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      session: import("express-session").Session & Partial<import("express-session").SessionData> & {
        userId?: number;
        userEmail?: string;
        userRole?: string;
      };
    }
  }
}
