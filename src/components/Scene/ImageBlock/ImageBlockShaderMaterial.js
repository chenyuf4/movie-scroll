// @ts-nocheck
import { ShaderMaterial } from "three";
import { extend } from "@react-three/fiber";
import { IMAGE_BLOCK_SIZE, IMAGE_SIZE, INACTIVE_GREYSCALE } from "./ImageBlock";

class ImageBlockShaderMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader: `
      #define PI 3.1415926535897932384626433832795
      uniform float boundary;
      uniform float uStrength;
      varying vec2 vUv;
      float zIndexFn(float inputVal) {
        if (inputVal < 0.5) {
          return 2.0 * inputVal * inputVal;
        }
        if (inputVal > 1.5) {
          return 2.0 * (inputVal - 2.0) * (inputVal - 2.0);
        }
        return -1. + (4.0 - 2.0 * inputVal ) * inputVal;
      }
      void main() {
        vec4 j=modelViewMatrix*vec4(position.xy,0.,1.);
        float z=0.;
        float k=abs(distance(j.x,0.));
        if(k<boundary) {
          z=(boundary-zIndexFn(k/boundary)*boundary)*uStrength;
        }
        gl_Position=projectionMatrix * vec4(j.xy,j.z+z,j.w);
        vUv = uv;
      }`,
      fragmentShader: `
      uniform sampler2D tex;
      varying vec2 vUv;
      uniform vec2 planeDimension;
      uniform float greyScale;
      void main() {
        float x = vUv.x;
        float y = vUv.y;
        vec4 imageTexture = texture2D(tex, vec2((x - 0.5) * planeDimension.x + 0.5, (y - 0.5) * planeDimension.y + 0.5));
        gl_FragColor = imageTexture * greyScale;
      }`,
      uniforms: {
        tex: { value: null },
        boundary: { value: 0 },
        uStrength: { value: 0 },
        greyScale: { value: INACTIVE_GREYSCALE },
        planeDimension: {
          value: [
            ((IMAGE_BLOCK_SIZE.width / IMAGE_BLOCK_SIZE.height) *
              IMAGE_SIZE.height) /
              IMAGE_SIZE.width,
            1,
          ],
        },
      },
    });
  }

  set uStrength(value) {
    this.uniforms.uStrength.value = value;
  }

  get uStrength() {
    return this.uniforms.uStrength.value;
  }

  set boundary(value) {
    this.uniforms.boundary.value = value;
  }

  get boundary() {
    return this.uniforms.boundary.value;
  }

  set tex(value) {
    this.uniforms.tex.value = value;
  }

  get tex() {
    return this.uniforms.tex.value;
  }

  get greyScale() {
    return this.uniforms.greyScale.value;
  }

  set greyScale(value) {
    this.uniforms.greyScale.value = value;
  }
}

extend({ ImageBlockShaderMaterial });
