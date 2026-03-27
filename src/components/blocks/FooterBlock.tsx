import React from 'react'
import styles from './FooterBlock.module.css'

export const FooterBlock: React.FC = () => (
  <footer className={styles.footer}>
    <div className={`container ${styles.inner}`}>
      <span className={styles.name}>Vaibhav Bharadwaj</span>
      <span className={styles.copy}>© {new Date().getFullYear()} · Tempe, AZ</span>
    </div>
  </footer>
)
