const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/400-bad-request-error');
const UnauthorizedError = require('../errors/401-unauthorized-error');
const NotFoundError = require('../errors/404-not-found-error');
const ConflictError = require('../errors/409-conflict-error');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const SALT_ROUNDS = 10;
const MONGO_DUPLICATE_ERROR_CODE = 11000;

exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users.length >= 1) {
        res.send(users);
      } else {
        throw new NotFoundError('Пользователи не найдены');
      }
    })
    .catch(next);
};

exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы невалидный id'));
      }
      next(err);
    });
};

exports.getMyProfile = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => res.send(user))
    .catch(next);
};

exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Не передан email или пароль');
  }

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((createUser) => res.status(200).send({
      _id: createUser._id,
      name: createUser.name,
      about: createUser.about,
      avatar: createUser.avatar,
      email: createUser.email,
    }))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError('Пользователь уже существует'));
      }
      next(err);
    });
};

exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((userProfile) => {
      if (userProfile) {
        res.send(userProfile);
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((userAvatar) => {
      if (userAvatar) {
        res.send(userAvatar);
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Не передан email или пароль');
  }

  User.findOne({ email })
    .select('+password')
    .then((userIsExist) => {
      if (!userIsExist) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      bcrypt
        .compare(password, userIsExist.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          const token = jwt.sign({ _id: userIsExist._id }, NODE_ENV === 'production' ? JWT_SECRET : 'extremly_secret_key', {
            expiresIn: '7d',
          });
          res
            .cookie('userToken', token, {
              maxAge: 360000000,
              httpOnly: true,
              sameSite: true,
            })
            .send({ _id: userIsExist._id });
        })
        .catch(next);
    })
    .catch(next);
};
