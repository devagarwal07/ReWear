import React from 'react';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
    return (
        <div className={styles.container}>
            <header className={styles.header}></header>
            <div className={styles.profileSection}>
                <div className={styles.avatar}></div>
                <div className={styles.info}></div>
                <div className={styles.stats}></div>
            </div>
            <div className={styles.myListings}>
                <h3>My Listings</h3>
                <div className={styles.grid}>
                    <div className={styles.card}></div>
                    <div className={styles.card}></div>
                    <div className={styles.card}></div>
                </div>
            </div>
            <div className={styles.myPurchases}>
                <h3>My Purchases</h3>
                <div className={styles.grid}>
                    <div className={styles.card}></div>
                    <div className={styles.card}></div>
                    <div className={styles.card}></div>
                </div>
            </div>
        </div>
    );
}
