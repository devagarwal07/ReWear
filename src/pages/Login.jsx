import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import styles from '../styles/Login.module.css';

export default function Login() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.avatar}></div>
                <SignIn afterSignInUrl="/onboarding" afterSignUpUrl="/onboarding" />
            </div>
        </div>
    );
}
