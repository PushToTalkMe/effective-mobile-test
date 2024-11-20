import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './config/db.js';
import { actionLogsRouter } from './routes/action-logs.routes.js';
import { connectToRabbitMQ } from './services/rabbitmq.js';

AppDataSource.initialize()
  .then(() => {
    console.log('База данных успешно инициализирована!');
  })
  .catch((err) => {
    console.error('Ошибка инициализации базы данных:', err);
  });

await connectToRabbitMQ();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(actionLogsRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
