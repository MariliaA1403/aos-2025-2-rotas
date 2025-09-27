import { Router } from "express";

const router = Router();

// Rota GET
router.get("/", (req, res) => {
  return res.send("Recebido um método HTTP GET");
});

// Rota POST
router.post("/", (req, res) => {
  return res.send("Recebido um método HTTP POST");
});

// Rota PUT
router.put("/", (req, res) => {
  return res.send("Recebido um método HTTP PUT");
});

// Rota DELETE
router.delete("/", (req, res) => {
  return res.send("Recebido um método HTTP DELETE");
});

export default router;
