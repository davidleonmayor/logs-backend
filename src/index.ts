import { cyan } from "colors";
import { app } from "./server";
import { initializeDB } from "../db/config";

const port = process.env.PORT || 4000;

app.listen(port, async () => {
  await initializeDB();
  console.log(cyan.bold(`REST API en el puerto ${port}`));
});
