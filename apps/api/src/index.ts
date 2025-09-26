import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import { PORT } from "./env";

import spaceRoutes from "./modules/space/space.routes";
import checkinRoutes from "./modules/checkin/checkin.routes";
import { identify } from "./middleware/identify";


const app = express();

app.use(cors());
app.use(express.json());


//middlewares
app.use(identify)

app.use("/api/space", spaceRoutes);
app.use("/api/checkin", checkinRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});