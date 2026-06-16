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

### 5. Build de produção

```bash
npm run build
npm start
```

---

## Migração para TypeScript

Este projeto agora usa TypeScript em `src/`, com saída compilada em `dist/`.

- A entrada do servidor é `src/server.ts`.
- O build é feito por `npm run build`.
- O servidor de desenvolvimento usa `ts-node-dev` com `npm run dev`.
- As importações no TypeScript usam extensões explícitas, por exemplo `import router from './routes/index.js'`.

---

## ATENÇÃO DEV

1. Não desenvolver na branch main.
2. Sempre crie uma branch da feature que estiver implementando.
   (`git checkout -b seunome-backend`)

---

## Arquitetura — API de Users e Tasks

A arquitetura segue o padrão em camadas. O fluxo de uma requisição é:

```
Routes → Middleware → Controller → Service → Repository → Model (MongoDB)
```

---

### 1. models/

Define o schema do MongoDB com Mongoose. É a representação dos dados no banco.

- `src/models/User.model.ts` — campos: `name`, `email`, `password`, `createdAt`
- `src/models/task.model.ts` — campos: `title`, `description`, `status`, `userId`, `deadlineHistory`, `createdAt`

```ts
// exemplo: src/models/task.model.ts
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: { type: String, enum: ['PENDING', 'IN_PROGRESS', 'DONE', 'CANCELLED'], default: 'PENDING' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export default mongoose.model('Task', taskSchema);
```

---

### 2. repositories/

Responsável por toda comunicação com o banco de dados. Usa os models diretamente.
Não contém regra de negócio.

- `src/repositories/task.repository.ts` — `createTask`, `getTasksByUserId`, `getTaskById`, `updateTask`, `deleteTask`

```ts
// exemplo: src/repositories/task.repository.ts
import Task from '../models/task.model.js';

export const createTask = (data: any) => Task.create(data);
export const findAllTasks = (userId: string) => Task.find({ userId });
```

---

### 3. services/

Contém as regras de negócio. Chama o repository e aplica validações, lógica e transformações.

- `src/services/task.service.ts` — validação de título, normalização, tratamento de duplicatas

```ts
// exemplo: src/services/task.service.ts
import * as taskRepository from '../repositories/task.repository.js';

export const createTask = async (data: any) => {
  if (!data.title) throw new Error('Title is required');
  return taskRepository.createTask(data);
};
```

---

### 4. controllers/

Recebe a requisição HTTP, chama o service e devolve a resposta. Não contém regra de negócio.

- `src/controllers/task.controller.ts` — `create`, `list`, `update`, `remove`

```ts
// exemplo: src/controllers/task.controller.ts
import * as taskService from '../services/task.service.js';

export const create = async (req, res) => {
  const task = await taskService.createTask(req.body);
  res.status(201).json(task);
};
```

---

### 5. middlewares/

Funções executadas antes do controller. Usadas para autenticação e validação.

- `src/middlewares/auth.middleware.ts` — valida o header `x-user-id` e injeta o usuário em `req.user`

```ts
// exemplo: src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const userId = req.header('x-user-id');
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  req.user = { id: userId };
  next();
};
```

---

### 6. routes/

Mapeia as URLs para os controllers, aplicando middlewares quando necessário.

- `src/routes/task.routes.ts` — `GET /tasks`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`
- `src/routes/index.ts` — agrega todas as rotas e exporta para o `server.ts`

```ts
// exemplo: src/routes/task.routes.ts
import { Router } from 'express';
import * as taskController from '../controllers/task.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);
router.post('/', taskController.create);
router.get('/', taskController.list);

export default router;
```

---

### 7. config/

- `src/config/database.config.ts` — conexão com o MongoDB via Mongoose usando a variável `MONGO_URI` do `.env`
