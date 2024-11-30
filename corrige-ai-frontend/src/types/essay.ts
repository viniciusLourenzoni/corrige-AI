import { StatusCorrectionEnum } from "./enums";

export interface Essay {
  id: string;
  title: string;
  content: string;
  status: StatusCorrectionEnum;
  studentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Correction {
  id: string;
  essayId: string;
  teacherId: string;
  feedback: string;
  score: number;
  createdAt: string;
}
