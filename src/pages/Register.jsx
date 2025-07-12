import React from 'react';
import styles from '../styles/Register.module.css';

export default function Register() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.avatar}></div>
                <input className={styles.input} type="text" placeholder="Field 1" />
                <input className={styles.input} type="text" placeholder="Field 2" />
                <input className={styles.input} type="text" placeholder="Field 3" />
                <input className={styles.input} type="text" placeholder="Field 4" />
                <button className={styles.button}>Register</button>
            </div>
            <div className={styles.info}>
                <p>Form-based login/signup</p>
                <p>Option for social login</p>
                <p>Redirects to dashboard upon success</p>
            </div>
        </div>
    );
}
