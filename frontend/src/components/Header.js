import logo from '../images/logo/logo.svg';
import { Link, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

function Header({ onSignOut, userEmail }) {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  function toggleBurger() {
    setIsBurgerOpen(!isBurgerOpen);
  }

  return (
    <header className="header page__section">
      <Routes>
        <Route
          exact
          path="/"
          element={
            <div
              className={`header__info-mobile ${
                isBurgerOpen ? 'header__info-mobile_opened' : ''
              }`}
            >
              <p className="header__email">{userEmail}</p>
              <button className="button header__button" onClick={onSignOut}>
                Выход
              </button>
            </div>
          }
        ></Route>

        {/* <div className="header__container">
        <img className="logo" src={logo} alt="Логотип Mesto Russia" /> */}

        <Route
          exact
          path="/"
          element={
            <>
              <div className="header__info-desktop">
                <p className="header__email">{userEmail}</p>
                <button className="button header__button" onClick={onSignOut}>
                  Выйти
                </button>
              </div>
              <div
                className={`header__info-burger ${
                  isBurgerOpen ? 'header__info-burger_close' : ''
                }`}
                onClick={toggleBurger}
              ></div>
            </>
          }
        ></Route>

        <Route
          path="/signup"
          element={
            <Link className="header__link" to="/signin">
              Войти
            </Link>
          }
        ></Route>

        <Route
          path="/signin"
          element={
            <Link className="header__link" to="/signup">
              Регистрация
            </Link>
          }
        ></Route>
      </Routes>
      {/* </div> */}
    </header>
  );
}

export default Header;
