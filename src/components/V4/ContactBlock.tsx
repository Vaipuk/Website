import { useState } from 'react';
import { BentoTile } from './BentoGrid';
import styles from './ContactBlock.module.css';

export function ContactBlock() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(msg);
    const subject = encodeURIComponent(`Hello from ${name || 'your website'}`);
    window.location.href = `mailto:vaipuk96@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <BentoTile col={2} row={2} className={styles.contact}>
      <h2 className={styles.heading}>
        Say <em>hello</em>
      </h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className={styles.input}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="What's on your mind?"
          value={msg}
          onChange={e => setMsg(e.target.value)}
        />
        <button className={styles.btn} type="submit">
          {sent ? 'Opening mail →' : 'Send →'}
        </button>
      </form>
    </BentoTile>
  );
}
