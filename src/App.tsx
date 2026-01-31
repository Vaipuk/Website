import { useState } from 'react'
import { GridContainer } from './components/Layout/GridContainer'
// Tile import removed as we are using specific tiles now
import { SpotifyTile } from './components/Tiles/SpotifyTile'
import { IntroTile } from './components/Tiles/IntroTile'
import { LinkTile } from './components/Tiles/LinkTile'
import { ProjectTile } from './components/Tiles/ProjectTile'
import { PhotoTile } from './components/Tiles/PhotoTile'
import { ContactTile } from './components/Tiles/ContactTile'
import { ProjectOverlay } from './components/ProjectOverlay'
import { galleryImages } from './data/galleryConfig'
import './App.css'

function App() {
  const [selectedProject, setSelectedProject] = useState<{ title: string, description: string, gradient: string } | null>(null);

  const handleProjectClick = () => {
    setSelectedProject({
      title: "Tensor Aurora",
      description: "A blazing fast inference engine for edge devices.",
      gradient: "linear-gradient(45deg, #4f46e5, #9333ea)"
    });
  };

  return (
    <>
      <ProjectOverlay
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />

      <GridContainer>
        {/* Intro Tile */}
        <IntroTile />

        {/* Photo Tile (New) */}
        <PhotoTile
          linkTo="/gallery"
          images={galleryImages}
        />

        {/* Spotify Tile */}
        <SpotifyTile />

        {/* Projects */}
        <ProjectTile
          title="Tensor Aurora"
          description="A blazing fast inference engine for edge devices."
          imageSrc="/photos/tensor_aurora.png"
          gradient="linear-gradient(45deg, #4f46e5, #9333ea)"
          onClick={handleProjectClick}
        />

        {/* Social Links */}
        <LinkTile
          platform="Instagram"
          url="https://instagram.com"
          username="@bhard"
        />
        <LinkTile
          platform="GitHub"
          url="https://github.com/Vaipuk"
          username="@Vaipuk"
        />

        {/* More Links / Content */}
        <LinkTile
          platform="Blog"
          url="/blog"
          username="Still Thinking"
          isInternalLink={true}
        />
        <LinkTile
          platform="LinkedIn"
          url="https://www.linkedin.com/in/vaipuk/"
          username="@vaipuk"
        />

        {/* Contact / Reach Out Tile */}
        <ContactTile />

      </GridContainer>
    </>
  )
}

export default App
