import '../components/V4/v4-tokens.css';
import styles from './V4Page.module.css';
import { HeroSection } from '../components/V4/sections/HeroSection';
import { AboutSection } from '../components/V4/sections/AboutSection';
import { WorkSection } from '../components/V4/sections/WorkSection';
import { GallerySection } from '../components/V4/sections/GallerySection';
import { MusicSection } from '../components/V4/sections/MusicSection';
import { SocialSection } from '../components/V4/sections/SocialSection';
import { ContactSection } from '../components/V4/sections/ContactSection';

export default function V4Page() {
  return (
    <div data-theme="v4" className={styles.page}>
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <GallerySection />
      <MusicSection />
      <SocialSection />
      <ContactSection />
    </div>
  );
}
