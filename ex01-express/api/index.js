import "dotenv/config";
import cors from "cors";
import express from "express";

import models, { sequelize } from "./models";
import routes from "./routes";

const app = express();
app.set("trust proxy", true);

const corsOptions = {
  origin: ["http://example.com", "*"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sequelize
  .authenticate()
  .then(() => console.log("Conexão com o banco estabelecida com sucesso!"))
  .catch((err) => console.error("Erro ao conectar com o banco:", err));

app.use(async (req, res, next) => {
  const user = await models.User.findOne();
  req.context = {
    models,
    me: user,
  };
  next();
});

app.use("/", routes.root);
app.use("/session", routes.session);
app.use("/users", routes.user(models));
app.use("/messages", routes.message(models));
app.use("/tarefas", routes.tarefa(models));

const port = process.env.PORT ?? 3000;
const eraseDatabaseOnSync = process.env.ERASE_DATABASE === "true";

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    await createUsersWithMessages();
    await createInitialTarefas();
  }

  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}!`);
  });
});

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: "rwieruch",
      email: "rwieruch@email.com",
      messages: [
        { text: "Published the Road to learn React" },
        { text: "Published also the Road to learn Express + PostgreSQL" },
      ],
    },
    { include: [models.Message] }
  );

  await models.User.create(
    {
      username: "ddavids",
      email: "ddavids@email.com",
      messages: [
        { text: "Happy to release ..." },
        { text: "Published a complete ..." },
      ],
    },
    { include: [models.Message] }
  );

  console.log("Dados iniciais de usuários e mensagens criados com sucesso!");
};

const createInitialTarefas = async () => {
  await models.Tarefa.create({
    descricao: "Finalizar projeto backend",
    concluida: false,
    userId: 1,
  });

  await models.Tarefa.create({
    descricao: "Estudar Sequelize",
    concluida: false,
    userId: 2,
  });

  console.log("Tarefas iniciais criadas com sucesso!");
};
