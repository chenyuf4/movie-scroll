// @ts-nocheck
import { useTexture } from "@react-three/drei";
import React, { useRef } from "react";
import { IMAGES_ARRAY } from "utils/utilVariable";
import "./ImageBlockShaderMaterial";
import * as THREE from "three";
//图片的真实尺寸
export const IMAGE_SIZE = {
  width: 1920,
  height: 872,
};

export const IMAGE_SIZE_RATIO = 2.5 / 1000;
//图片的实际在threejs显示时候的大小
export const IMAGE_BLOCK_SIZE = {
  width: IMAGE_SIZE.width * IMAGE_SIZE_RATIO,
  height: IMAGE_SIZE.height * IMAGE_SIZE_RATIO,
  gap: 180 * IMAGE_SIZE_RATIO,
};

export const ACTIVE_GREYSCALE = 1;
export const INACTIVE_GREYSCALE = 1 / 3;
const {
  width: imageBlockWidth,
  height: imageBlockHeight,
  gap: imageBlockGap,
} = IMAGE_BLOCK_SIZE;

export const SCROLL_LIMIT =
  (IMAGES_ARRAY.length - 1) * (imageBlockWidth + imageBlockGap);

//复用geometry，提升性能
const IMAGE_PLANE_GEOMETRY = new THREE.PlaneGeometry(1, 1, 64, 64);
const ImageBlock = ({ imageUrl, index }) => {
  const defaultImagePosX = index * (imageBlockWidth + imageBlockGap);
  const imgRef = useRef();
  const [imgTex] = useTexture([imageUrl]);
  return (
    <mesh
      ref={imgRef}
      position={[defaultImagePosX, -imageBlockHeight / 3, 0]}
      scale={[imageBlockWidth, imageBlockHeight, 1]}
      geometry={IMAGE_PLANE_GEOMETRY}
    >
      <imageBlockShaderMaterial
        boundary={0.85 * imageBlockWidth}
        tex={imgTex}
        greyScale={index === 0 ? ACTIVE_GREYSCALE : INACTIVE_GREYSCALE}
      />
    </mesh>
  );
};

export default ImageBlock;
