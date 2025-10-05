import { Router } from "express";

const router = Router();

export default (models) => {
  // LISTAR todas as tarefas
  router.get("/", async (req, res) => {
    try {
      const tarefas = await models.Tarefa.findAll({ include: models.User });
      res.json(tarefas);
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // BUSCAR tarefa por ID
  router.get("/:id", async (req, res) => {
    try {
      const tarefa = await models.Tarefa.findByPk(req.params.id, { include: models.User });
      if (!tarefa) return res.status(404).json({ error: "Tarefa não encontrada" });
      res.json(tarefa);
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // CRIAR nova tarefa
  router.post("/", async (req, res) => {
    try {
      const tarefa = await models.Tarefa.create({
        descricao: req.body.descricao,
        concluida: req.body.concluida || false,
        userId: req.context?.me?.id || null, // opcional, se usar autenticação
      });
      res.status(201).json(tarefa);
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // ATUALIZAR tarefa
  router.put("/:id", async (req, res) => {
    try {
      const tarefa = await models.Tarefa.findByPk(req.params.id);
      if (!tarefa) return res.status(404).json({ error: "Tarefa não encontrada" });

      await tarefa.update({
        descricao: req.body.descricao,
        concluida: req.body.concluida,
      });
      res.json(tarefa);
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // DELETAR tarefa
  router.delete("/:id", async (req, res) => {
    try {
      const tarefa = await models.Tarefa.findByPk(req.params.id);
      if (!tarefa) return res.status(404).json({ error: "Tarefa não encontrada" });

      await tarefa.destroy();
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  return router;
};
