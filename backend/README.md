# Бэкенд для проекта Mesto

![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-56a14b?logo=mongodb&logoColor=white)
![Node](https://img.shields.io/badge/-Node.js-469837?logo=Node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-f3de35?logo=javaScript&logoColor=black)
![Webpack](https://img.shields.io/badge/-Webpack-99d6f8?logo=webpack&logoColor=black)



## Описание
Приложение на Express.js. Схемы и модели созданы через Mongoose. Все роуты, кроме `/signup` и `/signin`, защищены. Используется валидация Joi и celebrate. При регистрации пользователя пароль хешируется модулем bcrypt с добавлением соли. Реализована централизованная обработка ошибок. Настроено логирование запросов и ошибок.

## Задача
* Написать и развернуть бэкенд для проекта [Mesto](https://github.com/rizametovd/react-mesto-auth) на React

## Роуты
Для пользователей:</br>
```sh
GET /users — возвращает всех пользователей из базы
GET /users/:userId - возвращает пользователя по _id
POST /users — создаёт пользователя с переданными в теле запроса name, about и avatar
PATCH /users/me — обновляет профиль
PATCH /users/me/avatar — обновляет аватар
```
Для карточек:</br>
```sh
GET /cards — возвращает все карточки из базы
POST /cards — создаёт карточку с переданными в теле запроса name и link. owner проставляется
DELETE /cards/:cardId — удаляет карточку по _id
PUT /cards/:cardId/likes — поставить лайк карточке
DELETE /cards/:cardId/likes — убрать лайк с карточки
```

## Стек
* Node.js
* Express.js
* MongoDB
* JavaScript
* WebPack
* API

## Установка
Для запуска на локальной машине необходимо:</br>
1. Установить npm зависимости:</br>
```sh
npm install
```

2. Запустить MongoDB:
```sh
npm run mongod
```

3. Запустить в режиме разработки:</br>
```sh
npm run start — запускает сервер
npm run dev — запускает сервер с hot-reload
```
Если все прошло успешно, проект будет запущен на `http://localhost:3000`

### Дополнительно
Настроен линтер eslint с конфигурацией Airbnb. Он отлавливает ошибки и следит за единообразием кода. Посмотреть и исправить ошибки можно командой:
```sh
npx eslint ./
```
