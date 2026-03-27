import React, { useState } from 'react'
import { useReveal } from '../../hooks/useReveal'
import styles from './ContactBlock.module.css'

export const ContactBlock: React.FC = () => {
  const headRef = useReveal()
  const subRef  = useReveal(100)
  const formRef = useReveal(200)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section className={styles.contact}>
      <div className="container">
        <h2 ref={headRef as React.RefObject<HTMLHeadingElement>} className={styles.headline}>
          Let's build<br />something <em>great</em>
        </h2>
        <p ref={subRef as React.RefObject<HTMLParagraphElement>} className={styles.sub}>
          Have a project in mind, or just want to connect? I'm always open to a conversation.
        </p>
        <form
          ref={formRef as React.RefObject<HTMLFormElement>}
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <input className={styles.input} type="text" placeholder="Your name" required />
          <input className={styles.input} type="email" placeholder="Email address" required />
          <textarea className={`${styles.input} ${styles.textarea}`} placeholder="What's on your mind?" required />
          <button type="submit" className={styles.btn}>
            {submitted ? 'Sent ✓' : 'Send message →'}
          </button>
        </form>
      </div>
    </section>
  )
}
