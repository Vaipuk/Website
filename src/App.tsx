import { ThemeToggle } from './components/ThemeToggle'
import { HeroBlock }   from './components/blocks/HeroBlock'
import { AboutBlock }  from './components/blocks/AboutBlock'
import { WorkBlock }   from './components/blocks/WorkBlock'
import { MusicBlock }  from './components/blocks/MusicBlock'
import { LinksBlock }  from './components/blocks/LinksBlock'
import { ContactBlock } from './components/blocks/ContactBlock'
import { FooterBlock } from './components/blocks/FooterBlock'

function App() {
  return (
    <>
      <ThemeToggle />
      <main>
        <HeroBlock />
        <AboutBlock />
        <WorkBlock />
        <MusicBlock />
        <LinksBlock />
        <ContactBlock />
      </main>
      <FooterBlock />
    </>
  )
}

export default App
