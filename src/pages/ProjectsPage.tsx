import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GridContainer } from '../components/Layout/GridContainer';
import { ProjectTile } from '../components/Tiles/ProjectTile';
import { ProjectOverlay } from '../components/ProjectOverlay';
import styles from './ProjectsPage.module.css';

interface Project {
    id: string;
    title: string;
    description: string;
    gradient: string;
    imageSrc?: string;
    details?: string;
    tags?: string[];
}

// Project data
const PROJECTS: Project[] = [
    {
        id: 'tensor-aurora',
        title: 'Tensor Aurora',
        description: 'A blazing fast inference engine for edge devices.',
        gradient: 'linear-gradient(45deg, #4f46e5, #9333ea)',
        imageSrc: '/photos/tensor_aurora.png',
        details: 'Built with Rust and WebAssembly for maximum performance on resource-constrained devices.',
        tags: ['Rust', 'WebAssembly', 'ML/AI']
    },
    {
        id: 'neural-canvas',
        title: 'Neural Canvas',
        description: 'AI-powered generative art platform.',
        gradient: 'linear-gradient(45deg, #ec4899, #8b5cf6)',
        details: 'Create stunning artwork using state-of-the-art diffusion models.',
        tags: ['Python', 'PyTorch', 'React']
    },
    {
        id: 'data-forge',
        title: 'Data Forge',
        description: 'Real-time data pipeline orchestration.',
        gradient: 'linear-gradient(45deg, #14b8a6, #3b82f6)',
        details: 'Scalable ETL pipelines with monitoring and alerting built-in.',
        tags: ['Go', 'Kubernetes', 'Apache Kafka']
    },
    {
        id: 'quantum-sim',
        title: 'Quantum Sim',
        description: 'Quantum computing simulator for education.',
        gradient: 'linear-gradient(45deg, #f59e0b, #ef4444)',
        details: 'Interactive quantum circuit builder with visual state representation.',
        tags: ['TypeScript', 'Three.js', 'WebGL']
    },
];

export const ProjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
    };

    return (
        <div className={styles.page}>
            <ProjectOverlay
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                project={selectedProject ? {
                    title: selectedProject.title,
                    description: selectedProject.description,
                    gradient: selectedProject.gradient
                } : null}
            />

            <header className={styles.header}>
                <button onClick={() => navigate('/')} className={styles.backButton}>← Back to Home</button>
                <h1>Projects</h1>
            </header>

            <GridContainer>
                {PROJECTS.map(project => (
                    <ProjectTile
                        key={project.id}
                        title={project.title}
                        description={project.description}
                        gradient={project.gradient}
                        imageSrc={project.imageSrc}
                        onClick={() => handleProjectClick(project)}
                    />
                ))}
            </GridContainer>
        </div>
    );
};
