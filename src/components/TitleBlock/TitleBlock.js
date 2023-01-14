import clsx from "clsx";
import React from "react";
import { IMAGE_SUBTITLES, IMAGE_TITLES } from "utils/utilVariable";
import styles from "./TitleBlock.module.scss";
const TitleBlock = ({ id }) => {
  const title = IMAGE_TITLES[id];
  const subtitle = IMAGE_SUBTITLES[id].value;
  return (
    <div className="position-absolute start-0 end-0" style={{ top: "18vh" }}>
      <div className={clsx("position-relative", styles["title-text"])}>
        <div
          className={clsx(
            "WTKR-font display-1 d-flex justify-content-center position-relative overflow-hidden"
          )}
          style={{ visibility: id !== 0 ? "hidden" : "visible" }}
          id={`image-title-${id}`}
        >
          {title.map((item, index) => (
            <div
              key={item}
              style={{
                transform: id !== 0 ? "translateY(130%)" : "translateY(0%)",
              }}
            >
              {item}
              {index < item.length - 1 && <>&nbsp;</>}
            </div>
          ))}
        </div>
        <div
          className={clsx(
            "mt-3 d-flex justify-content-center position-relative overflow-hidden",
            IMAGE_SUBTITLES[id].fontClass
          )}
          style={{ visibility: id !== 0 ? "hidden" : "visible" }}
          id={`image-subtitle-${id}`}
        >
          {subtitle.split("").map((letter, index) => (
            <div
              key={index}
              style={{
                transform: id !== 0 ? "translateY(130%)" : "translateY(0%)",
              }}
            >
              {letter === " " ? <>&nbsp;</> : letter}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TitleBlock;
