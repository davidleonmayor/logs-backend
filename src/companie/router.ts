import { Router, Request, Response } from "express";
import { validateInputs } from "../commons/middleware/resourceInputs";
import { CompanieCont } from "./Controller";
import { CreateCompanie } from "./schema";

const router = Router();

router.post("/", validateInputs(CreateCompanie), CompanieCont.create);

router.get("/:id", CompanieCont.getOne);

router.delete("/:id", CompanieCont.remove);

router.put("/:id", validateInputs(CreateCompanie), CompanieCont.update);

export { router as companieRouter };
