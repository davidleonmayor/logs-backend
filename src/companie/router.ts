import { Router, Request, Response } from "express";
import { CreateCompanie } from "./schema"; // Your validation schema
import { validateInputs } from "../commons/middleware/resourceInputs"; // Input validation middleware
import Companie from "../../db/models/Companie";

const router = Router();

router.post(
  "/",
  validateInputs(CreateCompanie),
  async (req: Request, res: Response) => {
    const { name, address, phone, email } = req.body;

    try {
      // Check if the company already exists based on email
      const companieExists = await Companie.findOne({ where: { email } });
      if (companieExists) {
        res.status(400).json({ error: "Companie already exists" });
        return;
      }

      // Create a new companie entry in the database
      const companie = await Companie.create({
        name,
        address,
        phone,
        email,
      });

      res.status(201).json({ msg: "Companie created successfully", companie });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "There was an error creating the companie" });
    }
  }
);

export { router as companieRouter };
