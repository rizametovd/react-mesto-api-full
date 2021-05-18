import '../index.css';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import Hamburger from './Hamburger';
import InfoTooltip from './InfoTooltip';
import * as auth from '../utils/auth';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ name: '', link: '' });
  const [currentUser, setCurrentUser] = useState('');
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [hamburgerMenu, setHamburgerMenu] = useState(false);
  const [email, setEmail] = useState('');
  const [tooltipStatus, setTooltipStatus] = useState('');
  const history = useHistory();

  function onRegister(email, password) {
    auth
      .register(email, password)
      .then((res) => {
        if (res._id) {
          setTooltipStatus('success');
          history.push('/sign-in');
        }
      })
      .catch((res) => setTooltipStatus('fail'));
  }

  function onLogin({ password, email }) {
    auth
      .authorize({ password, email })
      .then((data) => {
        if (data._id) {
          setEmail(email);
          localStorage.setItem('userId', data._id);
          setLoggedIn(true);
          history.push('/');
        }
      })
      .catch((err) => console.log(err));
  }

  function onSignOut() {
    localStorage.removeItem('userId');
    setLoggedIn(false);
    setHamburgerMenu(false);
    history.push('/sign-in');
  }

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (userId) {
      auth
        .getContent(userId)
        .then((res) => {
          if (res) {
            setEmail(res.email);
            setLoggedIn(true);
            history.push('/');
          }
        })
        .catch((err) => console.log(err));
    }
  }, [history]);

  useEffect(() => {
      api
      .getInitialCards()
      .then((cardsData) => {
        setCards(cardsData);
      })
      .catch((err) => console.log(err));
  }, [loggedIn]);


  function handleCardLike(card) {
    const isLiked = card.likes.some((like) => like === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => {
            return (c._id === card._id ? newCard : c)
          })
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(removedCard) {
    api
      .removeCard(removedCard._id)
      .then(() => {
        setCards((cards) =>
          cards.filter((card) => card._id !== removedCard._id)
        );
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    api
      .getUserInfo()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => console.log(err));
  }, [loggedIn]);

  function handleUpdateUser(formData) {
    api
      .setUserInfo(formData)
      .then((formData) => {
        setCurrentUser(formData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(formData) {
    api
      .setUserAvatar(formData)
      .then((formData) => {
        setCurrentUser(formData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addCard(newCard)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleHamburgerMenuClick() {
    setHamburgerMenu((prevHamburgerMenuState) => !prevHamburgerMenuState);
  }

  function handleCardClick(cardData) {
    setSelectedCard(cardData);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({ name: '', link: '' });
    setTooltipStatus('');
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page page__content">
        <Hamburger
          isOpen={hamburgerMenu}
          onHamburgerMenuClick={handleHamburgerMenuClick}
          email={email}
          onSignOut={onSignOut}
        />
        <Header
          onHamburgerMenuClick={handleHamburgerMenuClick}
          onSignOut={onSignOut}
          email={email}
          hamburgerStatus={hamburgerMenu}
        />

        <Switch>
          <ProtectedRoute
            exact
            path="/"
            loggedIn={loggedIn}
            component={Main}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
          />

          <Route path="/sign-in">
            <Login onLogin={onLogin} />
          </Route>

          <Route path="/sign-up">
            <Register onRegister={onRegister} />
          </Route>

          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>

        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <InfoTooltip status={tooltipStatus} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
