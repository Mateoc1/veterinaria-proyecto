declare module "connect-pg-simple" {
  import type { Store } from "express-session";
  function connectPgSimple(session: any): new (options?: {
    conString?: string;
    tableName?: string;
    [key: string]: any;
  }) => Store;
  export default connectPgSimple;
}
