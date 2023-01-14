import clsx from "clsx";
import TitleBlock from "components/TitleBlock/TitleBlock";
import React from "react";
import Triangle from "static/icon/Triangle";
import { IMAGE_TITLES } from "utils/utilVariable";
import styles from "./Home.module.scss";

const Home = () => {
  return (
    <>
      <div
        className="p-5 GraphikL-font position-absolute top-0 end-0 start-0"
        style={{ zIndex: 10, paddingTop: 40 }}
      >
        <div className="d-flex justify-content-between">
          <div>STEPHEN</div>
          <div className="d-flex">
            <div id="markers">1 / 9</div>
            <div
              className={clsx(
                "text-decoration-underline",
                styles["nav-margin"]
              )}
            >
              INDEX
            </div>
          </div>
        </div>
        {IMAGE_TITLES.map((_, index) => (
          <TitleBlock id={index} key={index} />
        ))}
      </div>
      {/* center line */}
      <div
        className="position-absolute top-0 bottom-0 start-0 w-50"
        style={{ zIndex: 2 }}
      >
        <div
          className={clsx(
            styles["center-line"],
            "position-absolute top-0 h-100"
          )}
        ></div>
        <div
          className={clsx(
            styles["triangle-container"],
            "d-flex align-items-center justify-content-center position-absolute"
          )}
        >
          <Triangle />
        </div>
      </div>
    </>
  );
};

export default Home;
