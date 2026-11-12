import { useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import V4Page from './pages/V4Page';
import { GalleryPage } from './pages/GalleryPage';
import BlogPage from './pages/BlogPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { PAGE_METADATA, SITE_ORIGIN } from './data/site';
import { AmbientBackground } from './components/AmbientBackground';

export default function Website() {
  const { pathname } = useLocation();
  useEffect(() => {
    const path = pathname.replace(/\/+$/, '') || '/';
    const metadata = PAGE_METADATA[path] ?? { title: 'Page not found — Vaibhav Bharadwaj', description: 'Return to the portfolio to explore projects and photography.' };
    document.title = metadata.title;
    for (const [selector, content] of [
      ['meta[name="description"]', metadata.description],
      ['meta[property="og:title"]', metadata.title],
      ['meta[property="og:description"]', metadata.description],
      ['meta[name="twitter:title"]', metadata.title],
      ['meta[name="twitter:description"]', metadata.description],
      ['meta[property="og:url"]', `${SITE_ORIGIN}${path}`],
    ]) document.querySelector(selector)?.setAttribute('content', content);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${SITE_ORIGIN}${path}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return <>
    <a className="skipLink" href="#main-content">Skip to content</a>
    <main id="main-content" tabIndex={-1}>
      <Routes>
        <Route path="/" element={<V4Page />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="*" element={<div style={{ padding: '4rem 1.5rem' }}><h1>Page not found.</h1><Link to="/">Return home</Link></div>} />
      </Routes>
    </main>
    <AmbientBackground />
  </>;
}
