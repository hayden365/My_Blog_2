import express, { Request, Response, Router, RequestHandler } from "express";
import Project from "../models/Project";
import { verifyToken } from "../middlewares/verifyToken";

const router: Router = express.Router();

// 프로젝트 추가
router.post("/", verifyToken, (async (req: Request, res: Response) => {
  try {
    const {
      title,
      language,
      frontend_tech,
      backend_tech,
      isGroupProject,
      myRole,
      description,
      startDate,
      endDate,
      isOngoing,
      links,
      coverImg,
    } = req.body;

    const project = new Project({
      title,
      language,
      frontend_tech,
      backend_tech,
      isGroupProject,
      myRole,
      description,
      startDate,
      endDate,
      isOngoing,
      links,
      coverImg,
    });

    const savedProject = await project.save();
    res.json(savedProject);
    return;
  } catch (err) {
    console.error("Project creation error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}) as RequestHandler);

// update project
router.put("/:id", verifyToken, (async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    language,
    frontend_tech,
    backend_tech,
    isGroupProject,
    myRole,
    description,
    startDate,
    endDate,
    isOngoing,
    links,
    coverImg,
  } = req.body;

  const project = await Project.findOneAndUpdate(
    { _id: id },
    {
      title,
      language,
      description,
      frontend_tech,
      backend_tech,
      isGroupProject,
      myRole,
      startDate,
      endDate,
      isOngoing,
      links,
      coverImg,
    },
    { new: true }
  );

  res.json(project);
}) as RequestHandler);

// get all projects
router.get("/", (async (req: Request, res: Response) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    console.error("Project retrieval error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}) as RequestHandler);

// get project by id
router.get("/:id", (async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id);
    res.json(project);
  } catch (err) {
    console.error("Project retrieval error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}) as RequestHandler);

// delete project
router.delete("/:id", verifyToken, (async (req: Request, res: Response) => {
  const { id } = req.params;
  await Project.findByIdAndDelete(id);
  res.json({ message: "Project deleted successfully" });
}) as RequestHandler);

export default router;
