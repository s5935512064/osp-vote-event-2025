import React from "react";
import type { EmblaOptionsType } from "embla-carousel";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import "../../styles/embla.css";
type PropType = {
  slides: SlideType[];
  options?: EmblaOptionsType;
};

type SlideType = {
  id: number;
  src: string;
  alt: string;
  link: string;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla  !max-w-max w-full">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide) => (
            <a
              href={slide.link}
              target={slide.link != "#" ? "_blank" : "_self"}
              className="embla__slide group"
              key={slide.id}
            >
              <div className="w-full aspect-square relative rounded-md overflow-hidden ">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="object-cover w-full h-full group-hover:scale-105 transition-all duration-300"
                />
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="embla__controls !hidden">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(
                index === selectedIndex ? " embla__dot--selected" : ""
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
