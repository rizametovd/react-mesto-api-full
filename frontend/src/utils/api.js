class Api {
    constructor(config) {
        this._url = config.baseUrl;
        this._headers = config.headers;
    }

    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    }

    getUserInfo() {
        return fetch(`${this._url}/users/me`, {
            method: 'GET',
            'credentials': 'include',
            headers: this._headers
        })
            .then(this._checkResponse);
    }

    getInitialCards() {
        return fetch(`${this._url}/cards`, {
            method: 'GET',
            'credentials': 'include',
            headers: this._headers
        })
            .then(this._checkResponse);
    }

    setUserInfo(formData) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            'credentials': 'include',
            headers: this._headers,
            body: JSON.stringify({
                name: formData.name,
                about: formData.about
            })
        })
            .then(this._checkResponse);
    }

    addCard(formData) {
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            'credentials': 'include',
            headers: this._headers,
            body: JSON.stringify({
                name: formData.name,
                link: formData.link
            })
        })
            .then(this._checkResponse);
    }

    removeCard(id) {
        return fetch(`${this._url}/cards/${id}`, {
            method: 'DELETE',
            'credentials': 'include',
            headers: this._headers
        })
            .then(this._checkResponse);
    }

    changeLikeCardStatus(cardId, isLiked) {
        return fetch(`${this._url}/cards/${cardId}/likes/`, {
            method: isLiked ? 'PUT' : 'DELETE',
            'credentials': 'include',
            headers: this._headers
        })
            .then(this._checkResponse);
    }

    setUserAvatar(formData) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            'credentials': 'include',
            headers: this._headers,
            body: JSON.stringify({
                avatar: formData.avatar
            })
        })
            .then(this._checkResponse);
    }

}


export const api = new Api({
    baseUrl: 'https://api.mesto.rizametov.com',
    headers: {
        'Content-Type': 'application/json'
    }
});



