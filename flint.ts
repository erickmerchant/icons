import css from "@flint/framework/handlers/css";
import js from "@flint/framework/handlers/js";
import flint from "@flint/framework";
import index from "./src/index.ts";

const app = flint("src", "dist")
  .route("/", { handler: index })
  .file("/icon-set.js", { handler: js })
  .file("/index.css", { handler: css });

export default app;

if (import.meta.main) {
  app.run();
}
