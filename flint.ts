import css from "@flint/framework/handlers/css";
import flint, { pattern as p } from "@flint/framework";
import { view } from "@handcraft/lib/ssr";
import index from "./pages/index.ts";

const app = flint()
  .route("/", view(index), [])
  .route("/robots.txt")
  .file("/styles/index.css", css)
  .file(p`/*.css`, css);

export default app;

if (import.meta.main) {
  app.run();
}
