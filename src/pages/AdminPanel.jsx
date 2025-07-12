import React from 'react';
import styles from '../styles/AdminPanel.module.css';

export default function AdminPanel() {
    return (
        <div className={styles.container}>
            <header className={styles.header}></header>
            <div className={styles.nav}>
                <button>Manage User</button>
                <button>Manage Orders</button>
                <button>Manage Listings</button>
            </div>
            <div className={styles.section}>
                <h3>Manage Users</h3>
                <div className={styles.userList}>
                    {[1, 2, 3, 4].map((u) => (
                        <div className={styles.userRow} key={u}>
                            <div className={styles.avatar}></div>
                            <div className={styles.details}>Details</div>
                            <div className={styles.actions}>
                                <button>Actions 1</button>
                                <button>Action 2</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
