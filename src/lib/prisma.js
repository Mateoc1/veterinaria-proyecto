"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ||
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
// Habilitar foreign keys en SQLite (importante para relaciones)
if (process.env.DATABASE_URL?.includes("sqlite")) {
    exports.prisma.$executeRaw `PRAGMA foreign_keys = ON;`.catch(() => {
        // Ignorar errores si ya está habilitado
    });
}
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = exports.prisma;
}
exports.default = exports.prisma;
