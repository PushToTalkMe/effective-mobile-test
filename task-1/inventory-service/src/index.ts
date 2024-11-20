import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './config/db';
import { inventoryRouter } from './routes/inventory.routes';
import { productsRouter } from './routes/products.routes';
import { shopsRouter } from './routes/shop.routes';

AppDataSource.initialize()
  .then(() => {
    console.log('База данных успешно инициализирована!');
  })
  .catch((err) => {
    console.error('Ошибка инициализации базы данных:', err);
  });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(inventoryRouter, productsRouter, shopsRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
