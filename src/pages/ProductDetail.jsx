import React from 'react';
import styles from '../styles/ProductDetail.module.css';

export default function ProductDetail() {
    return (
        <div className={styles.container}>
            <header className={styles.header}></header>
            <div className={styles.main}>
                <div className={styles.images}>Add Images</div>
                <div className={styles.description}>Add Product Description</div>
            </div>
            <div className={styles.bottomRow}>
                <div className={styles.previousListings}>Previous Listings:</div>
                <button className={styles.swapBtn}>Available/Swap</button>
            </div>
        </div>
    );
}
