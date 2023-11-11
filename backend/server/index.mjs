import express from "express";
import { router } from "../routes/routes.mjs";

const app = express();
const port = 3000;

app.use("/api", router);

// Configurar Express para servir archivos estáticos desde el directorio "public"
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
