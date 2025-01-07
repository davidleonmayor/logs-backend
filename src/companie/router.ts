import { Router } from "express";
import { validateInputs } from "../commons/middleware/resourceInputs";
import { CompanieCnt } from "./Controller";
import { CreateCompanie } from "./schema";

const router = Router();

router.post("/", validateInputs(CreateCompanie), CompanieCnt.create);

router.get("/:id", CompanieCnt.getOne);

router.delete("/:id", CompanieCnt.remove);

router.put("/:id", validateInputs(CreateCompanie), CompanieCnt.update);

export { router as companieRouter };
