import css from "@flint/framework/handlers/css";
import js from "@flint/framework/handlers/js";
import flint from "@flint/framework";
import { view } from "@handcraft/lib/ssr";
import index from "./pages/index.ts";

const app = flint()
  .route("/", view(index))
  .file("/elements/icon-tile.js", js)
  .file("/styles/index.css", css);

export default app;

if (import.meta.main) {
  app.run();
}
