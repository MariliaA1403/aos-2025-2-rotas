import { Router } from "express";

const router = Router();

export default (models) => {
  // LISTAR todos os usuários
  router.get("/", async (req, res) => {
    try {
      const users = await models.User.findAll({ include: models.Message });
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // BUSCAR usuário por ID
  router.get("/:id", async (req, res) => {
    try {
      const user = await models.User.findByPk(req.params.id, { include: models.Message });
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // CRIAR novo usuário
  router.post("/", async (req, res) => {
    try {
      const user = await models.User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // ATUALIZAR usuário
  router.put("/:id", async (req, res) => {
    try {
      const user = await models.User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

      await user.update(req.body);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // DELETAR usuário
  router.delete("/:id", async (req, res) => {
    try {
      const user = await models.User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

      await user.destroy();
      res.status(204).send(); // sucesso sem conteúdo
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  return router;
};
