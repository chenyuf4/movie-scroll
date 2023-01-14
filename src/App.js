import "./App.scss";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useCallback, useEffect, useRef } from "react";
import Scene from "components/Scene/Scene";
import Home from "components/Home/Home";
import normalizeWheel from "normalize-wheel";
import {
  IMAGE_BLOCK_SIZE,
  SCROLL_LIMIT,
} from "components/Scene/ImageBlock/ImageBlock";
import gsap from "gsap";
import _debounce from "lodash/debounce";

import { Power4 } from "gsap";
import { useMediaQuery } from "react-responsive";
import {
  DESKTOP_THRESHOLD,
  HEIGHT_THRESHOLD,
  IMAGE_SUBTITLES,
} from "utils/utilVariable";
import MobilePage from "components/MobilePage/MobilePage";
let timeline = gsap.timeline();
const { width: imageBlockWidth, gap: imageBlockGap } = IMAGE_BLOCK_SIZE;
const SUBTITLE_SET = new Set(
  Array.from({ length: IMAGE_SUBTITLES.length })
    .map((_, index) => index)
    .filter((index) => IMAGE_SUBTITLES[index].value !== "")
);
const App = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: `(min-width: ${DESKTOP_THRESHOLD}px)`,
  });
  const isHeightEnough = useMediaQuery({
    query: `(min-height: ${HEIGHT_THRESHOLD}px)`,
  });

  const scrollPosRef = useRef({
    current: 0,
    target: 0,
  });
  const imageGroupRef = useRef([]);
  const targetImageRef = useRef(0);

  const animateTitleFn = _debounce((targetImageIndex) => {
    // @ts-ignore
    const imagesGroup = imageGroupRef.current.children || [];
    const targetTitleBlockId = `#image-title-${targetImageIndex}`;
    const targetSubTitleBlockId = `#image-subtitle-${targetImageIndex}`;

    timeline.kill();
    timeline = gsap.timeline();
    for (let index = 0; index < imagesGroup.length; index++) {
      if (index !== targetImageIndex) {
        timeline.set(`#image-title-${index}`, { visibility: "hidden" });
        if (SUBTITLE_SET.has(index))
          timeline.set(`#image-subtitle-${index}`, { visibility: "hidden" });
      }
    }

    timeline
      .set(targetTitleBlockId, { visibility: "visible" })
      .set(targetSubTitleBlockId, { visibility: "visible" })
      .fromTo(
        `${targetTitleBlockId} > div`,
        {
          transform: "translateY(130%)",
        },
        {
          transform: "translateY(0%)",
          duration: 0.8,
          stagger: 0.08,
          ease: Power4.easeOut,
        }
      );
    if (SUBTITLE_SET.has(targetImageIndex))
      timeline.fromTo(
        `${targetSubTitleBlockId} > div`,
        {
          transform: "translateY(130%)",
        },
        {
          transform: "translateY(0%)",
          duration: 0.43,
          stagger: 0.003,
          ease: Power4.easeOut,
        },
        "-=0.8"
      );
    targetImageRef.current = targetImageIndex;
  }, 150);

  const onWheelHandler = useCallback(
    (e) => {
      if (!isDesktopOrLaptop || !isHeightEnough) return;
      const { pixelX, pixelY } = normalizeWheel(e);
      const relativeSpeed = Math.min(
        Math.max(Math.abs(pixelX), Math.abs(pixelY)),
        100
      );
      const scrollSpeed = relativeSpeed * 0.02;

      let direction = "L";
      let horizonal = true;
      if (Math.abs(pixelY) > Math.abs(pixelX)) {
        horizonal = false;
      }
      if (horizonal) {
        if (pixelX < 0) {
          direction = "R";
        } else {
          direction = "L";
        }
      } else {
        if (pixelY < 0) {
          direction = "R";
        } else {
          direction = "L";
        }
      }

      // update target position
      let target =
        scrollPosRef.current.target +
        (direction === "L" ? -scrollSpeed : scrollSpeed);
      target = Math.max(-SCROLL_LIMIT, Math.min(0, target));
      scrollPosRef.current.target = target;

      // @ts-ignore update target image index
      const imagesGroup = imageGroupRef.current.children || [];
      let targetImageIndex = -1;
      let targetImageDistance = Number.MAX_VALUE;
      for (let index = 0; index < imagesGroup.length; index++) {
        const defaultPos = index * (imageBlockWidth + imageBlockGap);
        const targetPos = defaultPos + target;
        if (Math.abs(targetPos) < targetImageDistance) {
          targetImageDistance = Math.abs(targetPos);
          targetImageIndex = index;
        }
      }
      if (targetImageRef.current !== targetImageIndex) {
        const oldActiveImageIndex = targetImageRef.current;
        const oldActiveTitleBlockId = `#image-title-${oldActiveImageIndex}`;
        const oldActiveSubTitleBlockId = `#image-subtitle-${oldActiveImageIndex}`;
        timeline.to(`${oldActiveTitleBlockId} > div`, {
          transform: "translateY(-130%)",
          duration: 0.35,
          ease: Power4.easeOut,
        });
        if (SUBTITLE_SET.has(oldActiveImageIndex))
          timeline.to(
            `${oldActiveSubTitleBlockId} > div`,
            {
              transform: "translateY(-130%)",
              duration: 0.35,
              ease: Power4.easeOut,
            },
            "-=0.35"
          );

        timeline
          .set(oldActiveTitleBlockId, { visibility: "hidden" })
          .set(oldActiveSubTitleBlockId, { visibility: "hidden" });
        animateTitleFn(targetImageIndex);
      }
    },
    [animateTitleFn, isDesktopOrLaptop, isHeightEnough]
  );

  useEffect(() => {
    window.addEventListener("wheel", onWheelHandler);
    return () => {
      window.removeEventListener("wheel", onWheelHandler);
    };
  }, [onWheelHandler]);

  return (
    <>
      {isDesktopOrLaptop && isHeightEnough ? (
        <>
          <div
            id="loader"
            className="position-absolute top-0 bottom-0 start-0 end-0"
            style={{ background: "#f4f4f4", zIndex: 200 }}
          />
          <Canvas
            dpr={Math.max(window.devicePixelRatio, 2)}
            linear={true}
            flat={true}
            gl={{
              antialias: true,
              alpha: false,
            }}
            camera={{
              position: [0, 0, 5],
              far: 100,
              near: 0.1,
              fov: 75,
            }}
          >
            <Suspense fallback={null}>
              <color attach="background" args={["#f4f4f4"]} />
              <Scene
                scrollPosRef={scrollPosRef}
                imageGroupRef={imageGroupRef}
              />
            </Suspense>
          </Canvas>
        </>
      ) : (
        <MobilePage />
      )}
      <Home />
    </>
  );
};

export default App;
