## Тестовое задание для Effective Mobile

### Инициализация базы данных и краткое описание

Прежду всего нужно инициализировать базу данных PostgreSQL, добавив в нее базы для приложений.

Для этого в корне репозитория есть скрипт init-db.sql, который можно исполнить с помощью psql.

После его исполнения в базу данных PostgreSQL добавятся 3 базы: `users`, `history` и `inventory`.

`users` - для задания №2

`history` - для задания №1 - история взаимодействия

`inventory` - для задания №1 - остатки

Задание №1 реализовано с помощью NodeJS + Express, микросервис остатков типизирован с помощью Typescript, микросервис истории взаимодействия на чистом JavaScript.

Задание №2 реализовано на NestJS, а также добавлена миграция для генерации 1000000 пользователей.

Взаимодействие между микросервисами реализовано с помощью RabbitMQ.

В качестве ORM используется TypeORM.

### Запуск приложений

`history-service` запускается командой `npm run start`

`inventory-service` запускается командами:

```bash
npm run build && npm run start
```

`task-2` запускается командами:

```bash
npm run migration:run && npm run start:prod
```

### Описание заданий

**Задание 1**

Нужно реализовать 2 сервиса.

Один сервис остатков товаров в магазине. У товара могут быть следующие поля:

- PLU - артикул товара
- Название товара
- Количество товара на полке
- Количество товара в заказе
- Для какого магазина данных остаток
  Данные денормализованы, их нужно привести к 2-3 нормальной форме.
  Должны быть следующие endpoint:
- Создание товара
- Создание остатка
- Увеличение остатка
- Уменьшение остатка
- Получение остатков по фильтрам
  - plu
  - shop_id
  - количество остатков на полке (с-по)
  - количество остатков в заказе (с-по)
- Получение товаров по фильтрам
  - name
  - plu

Другой сервис истории действий с товарами.
В сервис “истории действий с товарами” нужно отправлять все события, которые происходят с товарами или остатками. Общение сервисов может происходить любым способом. Сервис “истории действий с товарами или остатками” должен иметь endpoint, который отдаст историю действий с фильтрами по:

- shop_id
- plu
- date (с-по)
- action
  и постраничной навигацией.

Фреймворк так же может быть любой, но не nest. Один из сервисов должен быть на JS, для второго можно использовать TS.

СУБД - postgresql

**Задание 2**

Нужно написать сервис, который работает с пользователями. В бд может быть более 1 миллиона пользователей (набить данными бд нужно самостоятельно. Например, написать миграцию, которая это сделает). Каждый пользователь имеет поля:

- Имя
- Фамилия
- Возраст
- Пол
- проблемы: boolean // есть ли проблемы у пользователя
  Нужно сделать endpoint, который проставить флаг проблемы у пользователей в false и посчитает, сколько пользователей имело true в этом флаге. Этот сервис нужно реализовать на nestjs
