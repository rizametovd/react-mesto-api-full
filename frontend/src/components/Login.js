import { useState } from 'react';


function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleAddEmail(e) {
        setEmail(e.target.value);
    }

    function handleAddPassword(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.onLogin({ password, email });
    }

    return (
        <div className="auth">
            <form className="auth__container" onSubmit={handleSubmit}>
                <h2 className="auth__title">Вход</h2>
                <label className="auth__label">
                    <input
                        id="email__input"
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="auth__field auth__input"
                        minLength="1"
                        maxLength="40"
                        required
                        onChange={handleAddEmail}
                    />
                </label>
                <label className="auth__label">
                    <input
                        id="password__input"
                        type="password"
                        name="password"
                        defaultValue=""
                        placeholder="Пароль"
                        className="auth__field auth__input"
                        minLength="2"
                        maxLength="200"
                        required
                        onChange={handleAddPassword}
                    />
                </label>
                <button className="auth__submit-button button auth__button" type='submit'>Войти</button>
            </form>
        </div>
    )
}

export default Login;