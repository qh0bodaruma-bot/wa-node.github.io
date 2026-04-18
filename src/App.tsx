
import Header from './components/Header';
import Hero from './components/Hero';
import Concept from './components/Concept';
import Services from './components/Services';
import Footer from './components/Footer';
import bgImage from './assets/bg-landscape.png';
import './index.css';

function App() {
  return (
    <div className="app-container bg-seigaiha">
      <div 
        className="landscape-bg" 
        style={{ backgroundImage: `url(${bgImage})` }} 
      ></div>
      <Header />
      <main>
        <Hero />
        <Concept />
        <Services />
      </main>
      <Footer />
    </div>
  );
}

export default App;
