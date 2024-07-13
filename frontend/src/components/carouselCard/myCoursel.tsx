import React, { useState } from 'react';
import './myCoursel.css'
import phoneman from "../../assets/phoneman.png";
import cardpic from "../../assets/cardpic.png";
import  girl from "../../assets/girl.png";

const images = [
  phoneman,
  cardpic,
  girl,
  phoneman,
  cardpic,
  girl,
  // Add more image URLs here
];

const MyCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="carousel">
      <button className="carousel-button prev" onClick={prevImage}>
        &lt;
      </button>
      <div className="carousel-images">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index}`}
            className={`carousel-image ${
              index === currentIndex ? 'active' : ''
            }`}
          />
        ))}
      </div>
      <button className="carousel-button next" onClick={nextImage}>
        &gt;
      </button>
  
    </div>
  );
};

export default MyCarousel;
