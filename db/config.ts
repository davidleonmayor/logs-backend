import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import color from "colors";
import path from "path";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables");
}

// Instancia de Sequelize que representa la conexión a la base de datos
export const db = new Sequelize(process.env.DATABASE_URL, {
  models: [path.resolve(__dirname, "../db/models/**/*")], // Where the models are located
  logging: false, // Disable logging in console
  dialectOptions: {
    ssl: {
      require: false, // Disable SSL
    },
  },
});

export async function initializeDB() {
  try {
    await db.sync({ force: false }); // No elimina datos existentes
    console.log(
      color.green.bold("Database connection has been established successfully")
    );
  } catch (err) {
    // console.log(err);
    console.log(color.red.bold("Database connection failed"));
  }
}
