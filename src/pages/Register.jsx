import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import styles from '../styles/Register.module.css';
import ClerkRegisterSync from '../components/ClerkRegisterSync';

export default function Register() {
    return (
        <div className={styles.container}>
            <ClerkRegisterSync />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <SignUp afterSignInUrl="/onboarding" afterSignUpUrl="/onboarding" />
            </div>
        </div>
    );
}
