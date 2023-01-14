import React, { useEffect } from "react";
import { IMAGES_ARRAY } from "utils/utilVariable";
import ImageBlock, {
  ACTIVE_GREYSCALE,
  IMAGE_BLOCK_SIZE,
  INACTIVE_GREYSCALE,
} from "./ImageBlock/ImageBlock";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
export const POS_LERP_FACTOR = {
  SCROLL: 3.16,
  LATENCY: 2.85,
  GREYSCALE: 4.7,
};

const { width: imageBlockWidth, gap: imageBlockGap } = IMAGE_BLOCK_SIZE;
const Scene = ({ scrollPosRef, imageGroupRef }) => {
  const activeImageRef = useRef(0);
  const latencyRef = useRef({
    current: 0,
    target: 0,
  });

  useEffect(() => {
    const loaderNode = document.getElementById("loader");
    if (loaderNode) loaderNode.style.display = "none";
  }, []);

  useFrame((_, deltaVal) => {
    if (!imageGroupRef.current) return;
    const { current, target } = scrollPosRef.current;
    const { target: targetLatency } = latencyRef.current;
    let newCurrentPos =
      current + (target - current) * POS_LERP_FACTOR.SCROLL * deltaVal;

    // update latency
    let latencyDiff = target - targetLatency;
    let newLatency =
      targetLatency + latencyDiff * POS_LERP_FACTOR.LATENCY * deltaVal;

    latencyRef.current.target = newLatency;

    // when target and latency之间的差距较大，说明速度较快，所以接下来的latencyDiff就会大
    // 那么latency.current.x的value就会大，导致ustrength比较大。然后慢慢速度降下来，
    // 导致latencyValue趋近0
    // 在useEffect要清空latencyValue = 0
    latencyRef.current.current +=
      (latencyDiff - latencyRef.current.current) *
      POS_LERP_FACTOR.LATENCY *
      deltaVal;

    const uStrength = Math.min(Math.abs(latencyRef.current.current) / 65, 0.3);
    // @ts-ignore
    const imagesGroup = imageGroupRef.current.children || [];

    let activeImageIndex = -1;
    let activeImageDistance = Number.MAX_VALUE;
    for (let index = 0; index < imagesGroup.length; index++) {
      const imageMesh = imagesGroup[index];
      const defaultPos = index * (imageBlockWidth + imageBlockGap);
      imageMesh.position.x = defaultPos + newCurrentPos;
      imageMesh.material.uniforms.uStrength.value = uStrength;

      if (Math.abs(imageMesh.position.x) < activeImageDistance) {
        activeImageDistance = Math.abs(imageMesh.position.x);
        activeImageIndex = index;
      }
    }

    //update right corner marker
    if (activeImageRef.current !== activeImageIndex)
      document.getElementById("markers").innerHTML = `${
        activeImageIndex + 1
      } / ${IMAGES_ARRAY.length}`;

    activeImageRef.current = activeImageIndex;

    // setup gray scale value
    for (let index = 0; index < imagesGroup.length; index++) {
      const imageMesh = imagesGroup[index];
      const newGreyScale =
        index === activeImageIndex ? ACTIVE_GREYSCALE : INACTIVE_GREYSCALE;
      let oldGreyScale = imageMesh.material.uniforms.greyScale.value;
      imageMesh.material.uniforms.greyScale.value +=
        (newGreyScale - oldGreyScale) * POS_LERP_FACTOR.GREYSCALE * deltaVal;
    }
    scrollPosRef.current.current = newCurrentPos;
  });
  return (
    <group ref={imageGroupRef}>
      {IMAGES_ARRAY.map((imgUrl, index) => {
        return <ImageBlock imageUrl={imgUrl} index={index} key={index} />;
      })}
    </group>
  );
};

export default Scene;
