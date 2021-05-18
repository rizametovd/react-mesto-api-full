import { Route } from 'react-router-dom';

function Hamburger(props) {

    return (
        <Route exact path="/">
            <div className={`hamburger-menu ${props.isOpen && 'hamburger-menu_opened'}`}>
                <div className="hamburger-menu__content">
                    <p className="hamburger__auth-email">{props.email}</p>
                    <button className="hamburger__auth-sign-out-button" onClick={props.onSignOut}>Выйти</button>
                </div>
            </div>
        </Route>
    )
}

export default Hamburger;