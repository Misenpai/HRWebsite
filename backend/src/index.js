// server.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5002" }));

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hr = await prisma.hR.findUnique({ where: { username } });

    if (!hr || hr.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Get all PI usernames for this HR
    const piRelations = await prisma.hRPIRelation.findMany({
      where: { username: hr.username },
    });

    const piUsernames = piRelations.map((relation) => relation.piUsername);

    res.json({
      success: true,
      username: hr.username,
      piUsernames: piUsernames,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`HR Backend running on port ${PORT}`));