export interface Project {
  id: string;
  index: string;
  kind: string;
  title: string;
  year: string;
  description: string;
  details: string;
  gradient: string;
  tags: string[];
  caseStudy?: { title: string; text: string }[];
}

export const PROJECTS: Project[] = [
  {
    id: 'tensor-aurora',
    index: '01',
    kind: 'Inference Engine · Rust',
    title: 'Tensor Aurora',
    year: '2026',
    description: 'An inference engine for resource-constrained edge devices.',
    details: 'Built with Rust and WebAssembly, with a streaming token API and quantization-aware kernels.',
    gradient: 'linear-gradient(45deg, #4f46e5, #9333ea)',
    tags: ['Rust', 'WebAssembly', 'ML/AI'],
    caseStudy: [
      {
        title: 'Problem',
        text: 'Bring model inference to edge devices with limited resources. The engine focuses on the runtime and token interface that an application uses to work with a model.',
      },
      {
        title: 'Role & scope',
        text: 'Engine development across a Rust implementation, a WebAssembly target, a streaming token API, and quantization-aware kernels.',
      },
      {
        title: 'Technical choices',
        text: 'Rust and WebAssembly provide the implementation and deployment target. The token API exposes output incrementally, while quantization-aware kernels handle the reduced-precision side of inference.',
      },
    ],
  },
  {
    id: 'neural-canvas',
    index: '02',
    kind: 'Generative AI · Python',
    title: 'Neural Canvas',
    year: '2025',
    description: 'A sketch-to-image platform for editorial illustration.',
    details: 'A diffusion-model pipeline fine-tuned for editorial illustration, with a React interface and a Python / PyTorch implementation.',
    gradient: 'linear-gradient(45deg, #ec4899, #8b5cf6)',
    tags: ['Python', 'PyTorch', 'React'],
  },
  {
    id: 'data-forge',
    index: '03',
    kind: 'Data Platform · Go',
    title: 'Data Forge',
    year: '2025',
    description: 'Real-time data pipeline orchestration with monitoring and alerts.',
    details: 'An ETL pipeline project built around Go, Kubernetes, and Apache Kafka, with monitoring and alerting for research dashboards.',
    gradient: 'linear-gradient(45deg, #14b8a6, #3b82f6)',
    tags: ['Go', 'Kubernetes', 'Apache Kafka'],
  },
  {
    id: 'quantum-sim',
    index: '04',
    kind: 'Education · TypeScript',
    title: 'Quantum Sim',
    year: '2024',
    description: 'A quantum circuit builder for learning through interaction.',
    details: 'An interactive circuit builder with a visual state representation, exploring superposition and entanglement with TypeScript, Three.js, and WebGL.',
    gradient: 'linear-gradient(45deg, #f59e0b, #ef4444)',
    tags: ['TypeScript', 'Three.js', 'WebGL'],
  },
];

export function getProjectFromSearch(search: string): Project | undefined {
  return PROJECTS.find(project => project.id === new URLSearchParams(search).get('project'));
}
