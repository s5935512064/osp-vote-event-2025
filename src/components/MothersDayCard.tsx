import React, { useState, useEffect, useCallback } from "react";
import {
  motion,
  type Transition,
  type TargetAndTransition,
  AnimatePresence,
} from "motion/react";
import TextLogo from "../assets/logo-title.webp";
import TitleRakMea from "../assets/text-rak-mother.webp";
import Letter from "../assets/letter.webp";
import LetterCard from "../assets/letter-card.webp";
import MothersDayActivity1 from "../assets/activity_mother/Happy Mother Day.webp";
import MothersDayActivity2 from "../assets/activity_mother/2_0.webp";
import MothersDayActivity3 from "../assets/activity_mother/3_0.webp";
import MothersDayActivity4 from "../assets/activity_mother/5_0.webp";
import MothersDayActivity5 from "../assets/activity_mother/6_0.webp";
import MothersDayActivity6 from "../assets/activity_mother/4_0.webp";
import MothersDayCardCreator from "./MothersDayCardCreator";
import EmblaCarousel from "./EmblaCarousel";
import type { EmblaOptionsType } from "embla-carousel";
import {
  MothersDayCardService,
  type MothersDayCard,
} from "@/lib/motherdaysService";

interface MothersDayCardProps {
  motherName?: string;
  message?: string;
  backgroundColor?: string;
  textColor?: string;
}

// Animation configurations
const createAnimation = (
  initial: TargetAndTransition,
  animate: TargetAndTransition,
  transition: Transition,
  hover?: TargetAndTransition,
  tap?: TargetAndTransition
) => ({
  initial,
  animate,
  transition,
  ...(hover && { whileHover: hover }),
  ...(tap && { whileTap: tap }),
});

const animations = {
  container: createAnimation({ opacity: 0 }, { opacity: 1, y: 0 }, {
    duration: 0.8,
    ease: "easeOut",
  } as Transition),
  logo: createAnimation(
    { opacity: 0, scale: 0.8, y: -30 },
    { opacity: 1, scale: 1, y: 0 },
    { duration: 0.7, ease: "easeOut" } as Transition,
    {
      scale: 1.05,
      transition: { duration: 0.3, ease: "easeInOut" } as Transition,
    }
  ),
  text: createAnimation({ opacity: 0, y: 30 }, { opacity: 1, y: 0 }, {
    duration: 0.6,
    ease: "easeOut",
  } as Transition),
  button: createAnimation(
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0 },
    { duration: 0.6, ease: "easeOut" } as Transition,
    {
      scale: 1.1,
      transition: { duration: 0.2, ease: "easeInOut" } as Transition,
    },
    { scale: 0.98, transition: { duration: 0.1 } as Transition }
  ),
  titleImage: createAnimation(
    { opacity: 0, scale: 0.8, rotate: -5 },
    { opacity: 1, scale: 1, rotate: 0 },
    { duration: 0.8, ease: "easeOut" } as Transition,
    { scale: 1.02, rotate: 2, transition: { duration: 0.3 } as Transition }
  ),
  letter: createAnimation(
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1 },
    { duration: 0.8 } as Transition,
    { scale: 1.05, transition: { duration: 0.3 } as Transition }
  ),
  letterCard: createAnimation(
    { x: 100, opacity: 0 },
    { x: 0, opacity: 1 },
    { duration: 0.8 } as Transition,
    { scale: 1.05, transition: { duration: 0.3 } as Transition }
  ),
  cardCreator: createAnimation(
    { opacity: 0, scale: 0.9, y: 20 },
    { opacity: 1, scale: 1, y: 0 },
    { duration: 0.8, ease: "easeOut" } as Transition
  ),
  fadeOut: createAnimation(
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.95 },
    { duration: 0.5, ease: "easeIn" } as Transition
  ),
};

const LogoSection: React.FC = () => (
  <div className="flex flex-col items-center justify-center z-10 lg:mt-16 px-6 lg:px-10 ">
    <motion.img
      src={TextLogo.src}
      alt="The Old Siam Plaza Logo"
      className="object-contain  drop-shadow max-h-[20vh] "
      {...animations.logo}
    />
  </div>
);

const MobileTitleSection: React.FC = () => (
  <div className="flex lg:hidden flex-col items-center justify-center max-w-screen-xl z-[-5] w-full px-4 md:px-10">
    <motion.img
      src={TitleRakMea.src}
      alt="Mother's Day Love Message"
      className="object-contain max-h-[50vh] md:max-h-[180px] w-auto h-auto drop-shadow-md"
      {...animations.titleImage}
    />
  </div>
);

const ContentSection: React.FC<{ onCreateCard: () => void }> = ({
  onCreateCard,
}) => (
  <div className="flex flex-col items-center justify-center z-[10] my-2">
    <motion.p
      className="text-white text-base md:text-lg xl:text-xl max-w-screen-sm text-center leading-relaxed"
      {...animations.text}
    >
      ในโอกาสวันแม่ 12 สิงหาคมปีนี้ ให้{" "}
      <span className="font-semibold whitespace-nowrap">
        ดิ โอลด์ สยาม พลาซ่า
      </span>{" "}
      เป็นสื่อกลางแทนความรักและความรู้สึกอันแสนอบอุ่นที่คุณมีต่อคุณแม่
    </motion.p>

    <motion.button
      onClick={onCreateCard}
      className="mt-4 md:mt-7 bg-[#ffaccd] text-[#0a3254] md:text-lg font-prompt font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md cursor-pointer"
      {...animations.button}
    >
      สร้างการ์ดวันแม่
    </motion.button>
  </div>
);

const DesktopTitleSection: React.FC = () => (
  <div className="hidden lg:flex flex-col items-center justify-center fixed left-1/2 -translate-x-1/2 inset-0 -bottom-[50%] xl:-bottom-[45%] max-w-screen-md xl:max-w-[1280px] px-4 z-[5] w-full">
    <motion.img
      src={TitleRakMea.src}
      alt="Mother's Day Love Message"
      className="object-contain max-h-[45vh] md:max-h-[250px] xl:max-h-[300px] w-auto h-auto drop-shadow-md"
      {...animations.titleImage}
    />
  </div>
);

const LetterDecorations: React.FC = () => (
  <>
    <div className="hidden xs:block fixed bottom-[9%] left-[-15%] sm:left-[-10%] sm:bottom-[10%] md:bottom-[5%]  lg:top-[-10%] lg:-left-[5%] rotate-[45deg] lg:rotate-[135deg] h-fit h-900-hidden">
      <motion.img
        src={Letter.src}
        alt="Mother's Day letter"
        className="object-contain max-h-[25vh]  md:max-h-[38vh] lg:max-h-[350px] 2xl:max-h-[450px] 2xl:max-w-[380px] w-auto h-auto drop-shadow-md"
        {...animations.letter}
      />
    </div>

    <div className="hidden xs:flex fixed bottom-[8%] right-[-25%] sm:bottom-[15%] sm:right-[-15%] md:bottom-[10%] lg:top-[30%] lg:-right-[7%] rotate-12 h-900-hidden">
      <motion.img
        src={LetterCard.src}
        alt="Mother's Day letter card"
        className="object-contain max-h-[20vh] md:max-h-[28vh] lg:max-h-[250px] 2xl:max-h-[400px] 2xl:max-w-[380px] w-auto h-auto drop-shadow-md"
        {...animations.letterCard}
      />
    </div>
  </>
);

const ActivityCarousel: React.FC = () => {
  const OPTIONS: EmblaOptionsType = {
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: false,
  };
  const SLIDES = [
    {
      id: 1,
      src: MothersDayActivity1.src,
      alt: "Mother's Day Activity 1",
      link: "https://www.facebook.com/share/p/1CNgKtkdEK/",
    },
    {
      id: 2,
      src: MothersDayActivity2.src,
      alt: "Mother's Day Blood Doante",
      link: "https://www.facebook.com/share/p/19MsQf3n6P/",
    },
    {
      id: 3,
      src: MothersDayActivity3.src,
      alt: "Mother's Day Activity 3",
      link: "https://www.facebook.com/share/p/1CNgKtkdEK/",
    },
    {
      id: 4,
      src: MothersDayActivity4.src,
      alt: "Mother's Day Activity 4",
      link: "https://www.facebook.com/share/p/1CNgKtkdEK/",
    },
    {
      id: 5,
      src: MothersDayActivity5.src,
      alt: "Workshop Silk",
      link: "https://www.facebook.com/share/p/19zzznjnZZ/",
    },
    {
      id: 6,
      src: MothersDayActivity6.src,
      alt: "Mother's Day Activity 6",
      link: "https://www.facebook.com/share/p/1CNgKtkdEK/",
    },
  ];

  return <EmblaCarousel slides={SLIDES} options={OPTIONS} />;
};

const MothersDayCardComponent: React.FC<MothersDayCardProps> = ({}) => {
  const [isCardCreatorOpen, setIsCardCreatorOpen] = useState(false);
  const [cardId, setCardId] = useState<string | null>(null);
  const [cardData, setCardData] = useState<MothersDayCard | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getCardById = async (cardId: string) => {
    const card = await MothersDayCardService.getCardById(cardId);
    setCardData(card);
  };

  // Check URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const createCard = urlParams.get("createcard");
    const cardId = urlParams.get("id");

    if (createCard === "true") {
      setIsCardCreatorOpen(true);
      setCardId(null);
    } else if (cardId) {
      setIsCardCreatorOpen(true);
      setCardId(cardId);
      getCardById(cardId);
    }
  }, []);

  const handleCreateCard = () => {
    setIsTransitioning(true);
    // Add URL parameter
    const url = new URL(window.location.href);
    url.searchParams.set("createcard", "true");
    window.history.pushState({}, "", url.toString());

    // Wait for fade out animation then show card creator
    setTimeout(() => {
      setIsCardCreatorOpen(true);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div className="relative w-full flex-1 mt-[10%] md:mt-[5%] lg:mt-0 overflow-hidden">
      <AnimatePresence mode="wait">
        {!isCardCreatorOpen ? (
          <motion.div
            key="main-content"
            className="flex flex-col items-center gap-4 justify-items-center"
            initial="initial"
            animate={"animate"}
            variants={{
              initial: animations.container.initial,
              animate: animations.container.animate,
              fadeOut: animations.fadeOut.animate,
            }}
            transition={
              isTransitioning
                ? animations.fadeOut.transition
                : animations.container.transition
            }
          >
            <LogoSection />
            <MobileTitleSection />
            <ContentSection onCreateCard={handleCreateCard} />
            <div className="my-7 w-full z-10">
              <ActivityCarousel />
            </div>
            {/* <LetterDecorations /> */}
          </motion.div>
        ) : (
          <motion.div
            key="card-creator"
            className="w-full"
            initial="initial"
            animate="animate"
            variants={{
              initial: animations.cardCreator.initial,
              animate: animations.cardCreator.animate,
              fadeOut: animations.fadeOut.animate,
            }}
            transition={animations.cardCreator.transition}
          >
            <div className="relative ">
              <MothersDayCardCreator
                isPreview={cardId != null && cardData != null}
                fetchCardData={cardData}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MothersDayCardComponent;
