import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/clerk-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <div className={styles.logoIcon}>
            <span>♻️</span>
          </div>
          <span className={styles.logoText}>ReWear</span>
        </Link>
        <div className={`${styles.navMenu} ${isMenuOpen ? styles.active : ''}`}>
          <ul className={styles.navLinks}>
            <li>
              <Link
                to="/"
                className={`${styles.navLink} ${isActive('/') ? styles.activeLink : ''}`}
                onClick={closeMenu}
              >
                <span className={styles.linkIcon}>🏠</span>
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/item-listing"
                className={`${styles.navLink} ${isActive('/item-listing') ? styles.activeLink : ''}`}
                onClick={closeMenu}
              >
                <span className={styles.linkIcon}>🔍</span>
                <span>Browse</span>
              </Link>
            </li>
            <li>
              <a
                href="#categories"
                className={styles.navLink}
                onClick={closeMenu}
              >
                <span className={styles.linkIcon}>📂</span>
                <span>Categories</span>
              </a>
            </li>
            <li>
              <Link
                to="/dashboard"
                className={styles.navLink}
                onClick={closeMenu}
              >
                <span className={styles.linkIcon}>📊</span>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <a
                href="#contact"
                className={styles.navLink}
                onClick={closeMenu}
              >
                <span className={styles.linkIcon}>📞</span>
                <span>Contact</span>
              </a>
            </li>
            <li>
              <Link
                to="/add-item"
                className={styles.navLink}
                onClick={closeMenu}
              >
                <span className={styles.linkIcon}>➕</span>
                <span>Add Item</span>
              </Link>
            </li>
            <li>
              <SignedOut>
                <SignInButton>
                  <span className={styles.navLink} style={{ cursor: 'pointer' }}>
                    <span className={styles.linkIcon}>👤</span>
                    <span>Login</span>
                  </span>
                </SignInButton>
              </SignedOut>
            </li>
            <li>
              <SignedOut>
                <SignUpButton>
                  <span className={styles.navLink} style={{ cursor: 'pointer' }}>
                    <span className={styles.linkIcon}>✨</span>
                    <span>Sign Up</span>
                  </span>
                </SignUpButton>
              </SignedOut>
            </li>
            <li>
              <SignedIn>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <UserButton appearance={{ elements: { avatarBox: { width: 32, height: 32 } } }} afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </li>
          </ul>
        </div>
        <div
          className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
