import React from 'react';
import styles from '../styles/ItemListing.module.css';

export default function ItemListing() {
    return (
        <div className={styles.container}>
            <header className={styles.header}></header>
            <div className={styles.search}></div>
            <div className={styles.main}>
                <div className={styles.image}>Product Image</div>
                <div className={styles.details}>
                    <h2>Product name</h2>
                    <p>description</p>
                </div>
            </div>
            <div className={styles.imagesRow}>
                <div className={styles.thumb}></div>
                <div className={styles.thumb}></div>
                <div className={styles.thumb}></div>
                <div className={styles.thumb}></div>
            </div>
        </div>
    );
}
