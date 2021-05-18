const BadRequestError = require('../errors/400-bad-request-error');
const UnauthorizedError = require('../errors/401-unauthorized-error');
const NotFoundError = require('../errors/404-not-found-error');
const Card = require('../models/card');

exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (cards.length >= 1) {
        res.send(cards);
      } else {
        throw new NotFoundError('Карточки не найдены');
      }
    })
    .catch(next);
};

exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new UnauthorizedError(
          'Это не ваша карточка. Вы не можете удалять чужие',
        );
      }

      Card.findByIdAndRemove(cardId)
        .then((cardToDelete) => res.send(cardToDelete))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((likeCard) => {
      if (likeCard) {
        res.send(likeCard);
      } else {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((likeCard) => {
      if (likeCard) {
        res.send(likeCard);
      } else {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};
