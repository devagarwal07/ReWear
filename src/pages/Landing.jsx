import React from 'react';
import styles from '../styles/Landing.module.css';

export default function Landing() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logo}>ReWear</div>
                <nav className={styles.nav}>
                    <a href="/">Home</a>
                    <a href="/browse">Browse</a>
                    <a href="/login">Login</a>
                    <a href="/register">Sign Up</a>
                </nav>
            </header>
            <div className={styles.hero}>
                <button className={styles.cta}>Start Swapping</button>
                <button className={styles.cta}>Browse Items</button>
            </div>
            <div className={styles.carousel}>Images</div>
            <div className={styles.categories}>
                <div>Categories Section</div>
                <div className={styles.grid}>
                    <div className={styles.category}></div>
                    <div className={styles.category}></div>
                    <div className={styles.category}></div>
                    <div className={styles.category}></div>
                    <div className={styles.category}></div>
                    <div className={styles.category}></div>
                </div>
            </div>
            <div className={styles.listings}>
                <div>Product Listings</div>
                <div className={styles.grid}>
                    <div className={styles.product}></div>
                    <div className={styles.product}></div>
                    <div className={styles.product}></div>
                    <div className={styles.product}></div>
                </div>
            </div>
        </div>
    );
}
