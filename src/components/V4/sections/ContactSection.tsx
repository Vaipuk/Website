import { Link } from 'react-router-dom';
import styles from './ContactSection.module.css';
import { Frame } from '../Frame';
import { SectionEyebrow } from '../SectionEyebrow';
import { Equalizer } from '../Equalizer';

/* ------------------------------------------------------------------ */
/* Contact Section                                                       */
/* ------------------------------------------------------------------ */

export function ContactSection() {
  return (
    <section id="contact" className={styles.section}>
      {/* Background Frame */}
      <div className={styles.backdrop} aria-hidden="true">
        <Frame hue={20} style={{ width: '100%', height: '100%', aspectRatio: 'unset' }} />
      </div>

      {/* Main grid */}
      <div className={styles.grid}>
        {/* Left column */}
        <div className={styles.left}>
          <SectionEyebrow>End Credits</SectionEyebrow>

          <h2 className={styles.headline}>
            Let&rsquo;s build<br />
            something{' '}
            <em className={styles.headlineEm}>great.</em>
          </h2>

          <p className={styles.sub}>
            Have a project in mind, or just want to connect? I&rsquo;m always
            open to a conversation.
          </p>

          <div className={styles.pills}>
            <a
              href="https://instagram.com/memyselfen_i"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.pill}
            >
              Instagram <span aria-hidden="true">→</span>
            </a>
            <a
              href="https://github.com/vaipuk"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.pill}
            >
              GitHub <span aria-hidden="true">→</span>
            </a>
            <a
              href="https://linkedin.com/in/vaipuk"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.pill}
            >
              LinkedIn <span aria-hidden="true">→</span>
            </a>
            <Link to="/blog" className={styles.pill}>
              Blog <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Right column — glass form card */}
        <div className={styles.formCard}>
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Name"
              className={styles.input}
              autoComplete="name"
            />
            <input
              type="email"
              placeholder="Email address"
              className={styles.input}
              autoComplete="email"
            />
            <textarea
              placeholder="What's on your mind?"
              rows={5}
              className={styles.textarea}
            />
            <button type="button" className={styles.submitBtn}>
              Send message <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        {/* Four-column grid */}
        <div className={styles.footerGrid}>
          {/* Col 1 — Brand */}
          <div className={styles.footerBrand}>
            <div className={styles.brandName}>
              Vaibhav <em className={styles.brandNameEm}>Bharadwaj</em>
            </div>
            <div className={styles.brandMeta}>
              Designer / Engineer<br />
              Tempe, AZ &mdash; 33.4&deg;N<br />
              Available Summer 2026
            </div>
          </div>

          {/* Col 2 — Sitemap */}
          <div>
            <div className={styles.footerHeading}>Sitemap</div>
            <nav>
              <a href="#work" className={styles.footerLink}>Work</a>
              <a href="#about" className={styles.footerLink}>About</a>
              <a href="#gallery" className={styles.footerLink}>Gallery</a>
              <a href="#music" className={styles.footerLink}>Music</a>
              <a href="#contact" className={styles.footerLink}>Contact</a>
            </nav>
          </div>

          {/* Col 3 — Elsewhere */}
          <div>
            <div className={styles.footerHeading}>Elsewhere</div>
            <nav>
              <a
                href="https://github.com/vaipuk"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://linkedin.com/in/vaipuk"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://instagram.com/memyselfen_i"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                Instagram <span aria-hidden="true">↗</span>
              </a>
              <a href="#" className={styles.footerLink}>
                Read.cv <span aria-hidden="true">↗</span>
              </a>
              <a href="mailto:vaipuk96@gmail.com" className={styles.footerLink}>
                Email <span aria-hidden="true">↗</span>
              </a>
            </nav>
          </div>

          {/* Col 4 — Colophon */}
          <div>
            <div className={styles.footerHeading}>Colophon</div>
            <div className={styles.colophon}>
              Set in Fraunces<br />
              &amp; JetBrains Mono<br />
              Shot on Fuji X-T5<br />
              Built with React<br />
              Hosted on Cloudflare
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className={styles.bottomStrip}>
          <span className={styles.copyright}>
            &copy; MMXXVI &mdash; Vaibhav Bharadwaj. All frames reserved.
          </span>
          <div className={styles.runningTime}>
            <Equalizer color="var(--v4-accent)" />
            <span>Running time 00:04:28 &middot; End credits</span>
          </div>
        </div>
      </footer>
    </section>
  );
}
