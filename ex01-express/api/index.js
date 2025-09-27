import "dotenv/config";
import cors from "cors";
import express from "express";

import models, { sequelize } from "./models";
import routes from "./routes";

const app = express();
app.set("trust proxy", true);

// Configuração do CORS
const corsOptions = {
  origin: ["http://example.com", "*"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware de log
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Teste de conexão com o banco
sequelize
  .authenticate()
  .then(() => console.log("Conexão com o banco estabelecida com sucesso!"))
  .catch((err) => console.error("Erro ao conectar com o banco:", err));

// Middleware para injetar contexto
app.use(async (req, res, next) => {
  const user = await models.User.findOne(); // pega o primeiro usuário existente
  req.context = {
    models,
    me: user,
  };
  next();
});

// Rotas
app.use("/", routes.root);
app.use("/session", routes.session);
app.use("/users", routes.user(models));
app.use("/messages", routes.message(models));

const port = process.env.PORT ?? 3000;
const eraseDatabaseOnSync = process.env.ERASE_DATABASE === "true";

// Sync com Sequelize e criação de dados iniciais
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    await createUsersWithMessages();
  }

  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}!`);
  });
});

// Função para criar usuários e mensagens iniciais
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

  console.log("Dados iniciais criados com sucesso!");
};
