import React from 'react';
import styles from '../styles/Login.module.css';

export default function Login() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.avatar}></div>
                <input className={styles.input} type="text" placeholder="Username" />
                <input className={styles.input} type="password" placeholder="Password" />
                <button className={styles.button}>Login</button>
            </div>
        </div>
    );
}
