import React from 'react';
import "./carouselCard.css"
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import phoneman from "../../assets/phoneman.png";
import cardpic from "../../assets/cardpic.png";
import  girl from "../../assets/girl.png";

function Slideshow() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Set slidesToShow to 3
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="carousel">
      <Slider {...settings}>
        <div className="box">
          <img src={phoneman} className="box-img" alt="Image 1" />
        </div>
        <div className="box">
          <img src={cardpic} className='middle-box' alt="Image 2" />
        </div>
        <div className="box">
          <img src={girl} className="box-img" alt="Image 3" />
        </div>
        <div className="box">
          <img src={girl} className="box-img" alt="Image 3" />
        </div>

      </Slider>
    </div>
  );
}

export default Slideshow;
