declare module "connect-sqlite3" {
  import type { Store } from "express-session";
  function factory(session: any): {
    new (opts?: { db?: string; dir?: string; table?: string }): Store;
  };
  export default factory;
}
