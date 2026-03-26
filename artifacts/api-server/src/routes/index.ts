import { Router, type IRouter } from "express";
import healthRouter from "./health";
import patientsRouter from "./patients";
import emergencyRouter from "./emergency";
import physicianRouter from "./physician";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(patientsRouter);
router.use(emergencyRouter);
router.use(physicianRouter);
router.use(statsRouter);

export default router;
