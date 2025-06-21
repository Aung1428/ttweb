import React, { useState, useEffect } from 'react';
import slide1 from '../images/slide1.png';
import slide2 from '../images/slide2.png';
import slide3 from '../images/slide3.png';
import slide4 from '../images/slide4.png';

interface HomeProps {
  openSigninModal: () => void;
}

const Home: React.FC<HomeProps> = ({ openSigninModal }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const slides = [
    { image: slide1, title: '' },
    { image: slide2, title: 'Learning' },
    { image: slide3, title: 'Leading' },
    { image: slide4, title: 'Empowering' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section id="home" className="home-container">
      <div className="slider-wrapper">
        <div 
          className="slider-track" 
          style={{ 
            transform: `translateX(-${currentImage * 100}%)`,
            transition: 'transform 0.8s ease-in-out'
          }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="slide">
              <img 
                src={slide.image} 
                alt={`Slide ${index + 1}`} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
              />
            </div>
          ))}
        </div>

        {/* Overlay for button or title */}
        <div className="slide-overlay">
          {currentImage === 0 ? (
            <button 
              className="get-started-btn"
              onClick={openSigninModal}
            >
              Get Started
            </button>
          ) : (
            <h2 className="slide-heading">{slides[currentImage].title}</h2>
          )}
        </div>

        {/* Indicators */}
        <div className="slider-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentImage ? 'active' : ''}`}
              onClick={() => setCurrentImage(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
