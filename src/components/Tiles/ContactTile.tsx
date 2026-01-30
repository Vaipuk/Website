import React, { useState } from 'react';
import { Tile } from '../Tile';
import styles from './ContactTile.module.css';

interface ContactTileProps {
    colSpan?: 1 | 2 | 3 | 4;
    rowSpan?: 1 | 2 | 3 | 4;
}

export const ContactTile: React.FC<ContactTileProps> = ({ colSpan = 2, rowSpan = 2 }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !message) return;

        setIsSending(true);
        // Simulate sending - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSending(false);
        setSent(true);

        // Reset after 3 seconds
        setTimeout(() => {
            setSent(false);
            setEmail('');
            setMessage('');
        }, 3000);
    };

    return (
        <Tile colSpan={colSpan} rowSpan={rowSpan} className={styles.contactTile}>
            <div className={styles.header}>
                <h3 className={styles.title}>Say hi</h3>
                <p className={styles.subtitle}>I'll try to reply asap ⚡</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    required
                />
                <textarea
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={styles.textarea}
                    rows={3}
                    required
                />
                <button
                    type="submit"
                    className={styles.button}
                    disabled={isSending || sent}
                >
                    {sent ? '✓ Sent!' : isSending ? 'Sending...' : 'Send'}
                </button>
            </form>
        </Tile>
    );
};
