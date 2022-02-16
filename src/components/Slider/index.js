import React, { useState, useEffect } from "react";
import "./styles.scss";

const DIRECTION_TYPE = {
  next: "NEXT",
  prev: "PREV",
  select: "SELECT",
};

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
};

const Slider = (props) => {
  const { children } = props;
  const [oldActiveSlide, setOldActiveSlide] = useState(2);
  const [slider, setSlider] = useState({
    slides: children,
    active: 2,
    needTransition: true,
    direction: "",
  });

  const windowSize = useWindowSize();
  console.log(windowSize);

  const handleSliderTranslateEnd = () => {
    const { direction } = slider;
    switch (direction) {
      case DIRECTION_TYPE.next:
        validateNextSlider();
        break;
      case DIRECTION_TYPE.prev:
        validatePrevSlider();
        break;
      case DIRECTION_TYPE.select:
        validateSelectSlider();
        break;
      default:
        break;
    }
  };

  const validateNextSlider = () => {
    const { active, slides } = slider;
    let _active = active;
    _active -= 1;
    const _slides = [...slides, ...slides.slice(0, 1)].slice(-slides.length);
    setOldActiveSlide(_active);
    setSlider({
      ...slider,
      needTransition: false,
      active: _active,
      slides: _slides,
    });
  };

  const validatePrevSlider = () => {
    const { active, slides } = slider;
    let _active = active;
    _active += 1;
    const _slides = [...slides.slice(-1), ...slides].slice(0, slides.length);
    setOldActiveSlide(_active);
    setSlider({
      ...slider,
      needTransition: false,
      active: _active,
      slides: _slides,
    });
  };

  const validateSelectSlider = () => {
    const { active, slides } = slider;
    let _active = active;
    let _slides = [...slides];
    if (active > oldActiveSlide) {
      for (let i = 0; i < active - oldActiveSlide; i++) {
        _active -= 1;
        _slides = [..._slides, ..._slides.slice(0, 1)].slice(-_slides.length);
      }
    } else {
      for (let i = 0; i < oldActiveSlide - active; i++) {
        _active += 1;
        _slides = [..._slides.slice(-1), ..._slides].slice(0, _slides.length);
      }
    }
    setOldActiveSlide(_active);
    setSlider({
      ...slider,
      needTransition: false,
      active: _active,
      slides: _slides,
    });
  };

  const handleNext = () => {
    const { active, slides } = slider;
    let _active = active + 1;
    if (_active > slides.length - 3) return;
    setSlider({
      ...slider,
      needTransition: true,
      active: _active,
      direction: DIRECTION_TYPE.next,
    });
  };

  const handlePrev = () => {
    const { active } = slider;
    let _active = active - 1;
    if (_active < 0) return;
    setSlider({
      ...slider,
      needTransition: true,
      active: _active,
      direction: DIRECTION_TYPE.prev,
    });
  };

  const handleSelect = (index) => {
    setSlider({
      ...slider,
      needTransition: true,
      active: index,
      direction: DIRECTION_TYPE.select,
    });
  };

  const getPercent = () => {
    const { width } = windowSize;
    if (width >= 992 && width < 1440) return 25;
    else if (width >= 768 && width < 992) return 100 / 3;
    else if (width >= 480 && width < 768) return 50;
    else if (width < 480) return 100;
    else return 20;
  };

  const transLateVal = () => {
    let percent = getPercent();
    if (percent === 25) return -((slider.active - 2) * percent) - percent / 2;
    else if (percent === 100 / 3)
      return -((slider.active - 2) * percent) - percent;
    else if (percent === 50)
      return -((slider.active - 2) * percent) - (3 * percent) / 2;
    else if (percent === 100)
      return -((slider.active - 2) * percent) - 2 * percent;
    return -((slider.active - 2) * percent);
  };

  const sliderStyle = () => {
    let percent = getPercent();
    if (slider.needTransition) {
      return {
        width: `${slider.slides.length * percent}vw`,
        transform: `translateX(${transLateVal()}vw)`,
        transition: "transform 0.3s ease-in-out",
      };
    }

    return {
      width: `${slider.slides.length * percent}vw`,
      transform: `translateX(${transLateVal()}vw)`,
    };
  };

  const slideClass = (index) => {
    if (index === slider.active) return "slideshow-slide active";
    else if (index === slider.active + 1) return "slideshow-slide next";
    else if (index === slider.active - 1) return "slideshow-slide prev";
    else return "slideshow-slide";
  };

  return (
    <div className="slideshow-container">
      <div
        className="slideshow-wrapper"
        style={sliderStyle()}
        onTransitionEnd={handleSliderTranslateEnd}
      >
        {slider.slides.map((item, index) => (
          <div
            className={slideClass(index)}
            key={index}
            onClick={() => handleSelect(index)}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="slideshow-control__prev" onClick={handlePrev}>
        <img src={require("../../assets/back.png")} />
      </div>
      <div className="slideshow-control__next" onClick={handleNext}>
        <img src={require("../../assets/next.png")} />
      </div>
    </div>
  );
};

export default Slider;
