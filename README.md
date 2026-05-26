## Primeiros Passos

### 1. Clone o repositório e instale as dependências

```bash
git clone https://github.com/taskinsight-squad-2/taskinsight-backend.git
cd taskinsight-backend
npm install
```

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha os valores:

```bash
cp .env.example .env
```

```env
PORT=3000
MONGO_URI=
JWT_SECRET=
```

### 3. Crie sua branch

```bash
git checkout -b seunome-backend
```

### 4. Rode o projeto

```bash
npm run dev
```

---

## ATENÇÃO DEV

1. Não desenvolver na branch main
2. Sempre crie uma branch da feature que estiver implementando.
   (git checkout -b seunome-backend)

---

## Guia de Desenvolvimento — API de Users e Tasks

A arquitetura segue o padrão em camadas. O fluxo de uma requisição é:

```
Routes → Middleware → Controller → Service → Repository → Model (MongoDB)
```

---

### 1. models/

Define o schema do MongoDB com Mongoose. É a representação dos dados no banco.

- `user.model.js` — campos: `name`, `email`, `password`, `createdAt`
- `task.model.js` — campos: `title`, `description`, `status`, `userId`, `createdAt`

```js
// exemplo: src/models/task.model.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: { type: String, enum: ["pending", "done"], default: "pending" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("Task", taskSchema);
```

---

### 2. repositories/

Responsável por toda comunicação com o banco de dados. Usa os models diretamente.
Não contém regra de negócio.

- `user.repository.js` — `create`, `findByEmail`, `findById`
- `task.repository.js` — `create`, `findAll`, `findById`, `update`, `delete`

```js
// exemplo: src/repositories/task.repository.js
import Task from "../models/task.model.js";

export const createTask = (data) => Task.create(data);
export const findAllTasks = (userId) => Task.find({ userId });
```

---

### 3. services/

Contém as regras de negócio. Chama o repository e aplica validações, lógica e transformações.

- `user.service.js` — hash de senha, verificação de e-mail duplicado
- `task.service.js` — validar se o usuário existe antes de criar uma task

```js
// exemplo: src/services/task.service.js
import * as taskRepository from "../repositories/task.repository.js";

export const createTask = async (data) => {
  if (!data.title) throw new Error("Title is required");
  return taskRepository.createTask(data);
};
```

---

### 4. controllers/

Recebe a requisição HTTP, chama o service e devolve a resposta. Não contém regra de negócio.

- `user.controller.js` — `register`, `login`
- `task.controller.js` — `create`, `list`, `update`, `delete`

```js
// exemplo: src/controllers/task.controller.js
import * as taskService from "../services/task.service.js";

export const create = async (req, res) => {
  const task = await taskService.createTask(req.body);
  res.status(201).json(task);
};
```

---

### 5. middlewares/

Funções executadas antes do controller. Usadas para autenticação e validação.

- `auth.middleware.js` — valida o JWT e injeta o usuário em `req.user`

```js
// exemplo: src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  req.user = jwt.verify(token, process.env.JWT_SECRET);
  next();
};
```

---

### 6. routes/

Mapeia as URLs para os controllers, aplicando middlewares quando necessário.

- `user.routes.js` — `POST /users/register`, `POST /users/login`
- `task.routes.js` — `GET /tasks`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id` (todas protegidas)
- `index.js` — agrega todas as rotas e exporta para o `server.js`

```js
// exemplo: src/routes/task.routes.js
import { Router } from "express";
import * as taskController from "../controllers/task.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);
router.post("/", taskController.create);
router.get("/", taskController.list);

export default router;
```

---

### 7. config/

- `database.config.js` — conexão com o MongoDB via Mongoose usando a variável `MONGO_URI` do `.env`
