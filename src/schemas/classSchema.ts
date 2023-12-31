import joi from "joi";
import { ClassPayload } from "../types/classTypes";

const classSchema = joi.object<ClassPayload>({
  name: joi.string().trim().required(),
  imageUrl: joi.string().uri().required(),
  videoUrl: joi.string().uri().required(),
  summaryUrl: joi.string().uri().required(),
  moduleId: joi.string().trim().required(),
  dueDate: joi.date().iso().required(),
});

export default classSchema;
