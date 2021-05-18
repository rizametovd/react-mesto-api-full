const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { default: validator } = require('validator');

const usersRoutes = express.Router();
const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getMyProfile,
} = require('../controllers/users');

usersRoutes.get('/', getUsers);
usersRoutes.get('/me', getMyProfile);

usersRoutes.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

usersRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

usersRoutes.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message('Заполните поле валидным URL');
        })
        .message({
          'string.required': 'Поле должны быть заполнено',
        }),
    }),
  }),
  updateAvatar,
);

exports.usersRoutes = usersRoutes;
