import express, {
  Express,
  NextFunction,
  Request,
  Response,
  Router,
} from "express";

import { Worker, isMainThread, parentPort } from "worker_threads";

const app: Express = express();
const PORT = 4000;
const testRouter = Router();

app.use("/test", testRouter);

testRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.send("🧀TESTING WORKER THREADS🧀");
  } catch (error) {
    throw new Error(`${error}`);
  }
});

출처: https: app.listen(PORT, () =>
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`)
);
