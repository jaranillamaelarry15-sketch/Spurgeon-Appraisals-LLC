import Nav from './components/Nav'
import HeroSection from './sections/HeroSection'
import IntroSection from './sections/IntroSection'
import WorkSection from './sections/WorkSection'
import ToursSection from './sections/ToursSection'
import ProcessSection from './sections/ProcessSection'
import OrderJourneySection from './sections/OrderJourneySection'
import ServicesSection from './sections/ServicesSection'
import CtaSection from './sections/CtaSection'

export default function App() {
  return (
    <main className="relative bg-[#01170C]" style={{ overflowX: 'clip' }}>
      <Nav />
      <HeroSection />
      <IntroSection />
      <WorkSection />
      <ToursSection />
      <ProcessSection />
      <OrderJourneySection />
      <ServicesSection />
      <CtaSection />
    </main>
  )
}
