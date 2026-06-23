import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/V4/v4-tokens.css';
import styles from './ProjectsPage.module.css';

interface Project {
    id: string;
    index: string;
    kind: string;
    title: string;
    year: string;
    description: string;
    details: string;
    gradient: string;
    tags: string[];
}

const PROJECTS: Project[] = [
    {
        id: 'tensor-aurora',
        index: '01',
        kind: 'Inference Engine · Rust',
        title: 'Tensor Aurora',
        year: '2026',
        description: 'A blazing fast inference engine for edge devices.',
        details: 'Built with Rust and WebAssembly for maximum performance on resource-constrained devices, with a streaming token API and quantization-aware kernels.',
        gradient: 'linear-gradient(45deg, #4f46e5, #9333ea)',
        tags: ['Rust', 'WebAssembly', 'ML/AI'],
    },
    {
        id: 'neural-canvas',
        index: '02',
        kind: 'Generative AI · Python',
        title: 'Neural Canvas',
        year: '2025',
        description: 'AI-powered generative art platform.',
        details: 'Create stunning artwork using state-of-the-art diffusion models, with a sketch-to-image pipeline fine-tuned for editorial illustration.',
        gradient: 'linear-gradient(45deg, #ec4899, #8b5cf6)',
        tags: ['Python', 'PyTorch', 'React'],
    },
    {
        id: 'data-forge',
        index: '03',
        kind: 'Data Platform · Go',
        title: 'Data Forge',
        year: '2025',
        description: 'Real-time data pipeline orchestration.',
        details: 'Scalable ETL pipelines with monitoring and alerting built in, powering dashboards for a 40-person research lab.',
        gradient: 'linear-gradient(45deg, #14b8a6, #3b82f6)',
        tags: ['Go', 'Kubernetes', 'Apache Kafka'],
    },
    {
        id: 'quantum-sim',
        index: '04',
        kind: 'Education · TypeScript',
        title: 'Quantum Sim',
        year: '2024',
        description: 'Quantum computing simulator for education.',
        details: 'An interactive quantum circuit builder with a visual state representation, designed to make superposition and entanglement tangible.',
        gradient: 'linear-gradient(45deg, #f59e0b, #ef4444)',
        tags: ['TypeScript', 'Three.js', 'WebGL'],
    },
];

export const ProjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState<Project | null>(null);

    // Lock body scroll + Escape-to-close while the panel is open
    useEffect(() => {
        document.body.style.overflow = selected ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [selected]);

    useEffect(() => {
        if (!selected) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelected(null);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [selected]);

    return (
        <div data-theme="v4" className={styles.page}>
            <div className={styles.inner}>
                <button className={styles.back} onClick={() => navigate('/')}>← Home</button>
                <span className={styles.eyebrow}>Selected Work · The Index</span>
                <h1 className={styles.pageTitle}>Pro<em>jects.</em></h1>
                <p className={styles.subtitle}>
                    Experiments, tools, and things I built to learn something.
                </p>

                <div className={styles.projectList}>
                    {PROJECTS.map(p => (
                        <article
                            key={p.id}
                            className={styles.projectRow}
                            onClick={() => setSelected(p)}
                        >
                            <span className={styles.projectIndex}>{p.index}</span>
                            <div className={styles.projectMeta}>
                                <div className={styles.projectKind}>{p.kind}</div>
                                <h2 className={styles.projectName}>{p.title}</h2>
                            </div>
                            <p className={styles.projectBlurb}>{p.description}</p>
                            <div className={styles.projectActions}>
                                <span className={styles.projectYear}>{p.year}</span>
                                <span className={styles.projectView}>View →</span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {/* Detail panel — slides in from the right */}
            {selected && (
                <div className={styles.overlay} onClick={() => setSelected(null)}>
                    <div className={styles.panel} onClick={e => e.stopPropagation()}>
                        <div className={styles.panelAccent} style={{ background: selected.gradient }} />
                        <button className={styles.panelClose} onClick={() => setSelected(null)}>×</button>
                        <div className={styles.panelBody}>
                            <span className={styles.panelKind}>{selected.kind} · {selected.year}</span>
                            <h2 className={styles.panelTitle}>{selected.title}</h2>
                            <p className={styles.panelDesc}>{selected.description}</p>
                            <p className={styles.panelDetails}>{selected.details}</p>
                            <div className={styles.panelTags}>
                                {selected.tags.map(t => (
                                    <span key={t} className={styles.tag}>{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
