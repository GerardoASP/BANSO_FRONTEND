import React from 'react';
import Logo from '../../assets/images/LOGO_BANSO_v2_amarillo-removebg-preview.png';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaSignInAlt, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Importamos iconos de FontAwesome
import './WelcomePage.scss';

const WelcomePage = () => {
  return (
    <div className='welcome-page'>
      <div className='welcome-page__content'>
        <div className='welcome-page__logo'>
          <img src={Logo} alt="Logo" className='welcome-page__logo-icon' />
        </div>
        <h1 className='welcome-page__title'>Bienvenidos a BANSO</h1>
        <p className='welcome-page__description'>¡Desata tu potencial y domina el desarrollo con nosotros!</p>
      </div>
      <div className='welcome-page__actions'>
        <Link to="/register" className='welcome-page__button-link'>
          <button type='submit' className='welcome-page__button welcome-page__button--register'>
            <FaUserPlus className='welcome-page__icon' />
            <span>Registro</span>
          </button>
        </Link>
        <Link to="/login" className='welcome-page__button-link'>
          <button type='submit' className='welcome-page__button welcome-page__button--login'>
            <FaSignInAlt className='welcome-page__icon' />
            <span>Iniciar sesión</span>
          </button>
        </Link>
      </div>
      <div className='welcome-page__feature'>
        <h2 className='welcome-page__feature-title'>Descubre nuestras ventajas</h2>
        <p className='welcome-page__feature-description'>En BANSO ofrecemos un ambiente de aprendizaje innovador y una comunidad comprometida que te ayudará a alcanzar tus metas profesionales.</p>
      </div>
      <div className='welcome-page__footer'>
        <div className='welcome-page__footer-content'>
          Síguenos en nuestras redes sociales:
        </div>
        <div className='social-icons'>
          <FaFacebook className='social-icon' />
          <FaTwitter className='social-icon' />
          <FaInstagram className='social-icon' />
        </div>
      </div>
    </div>
  )
}

export default WelcomePage;
