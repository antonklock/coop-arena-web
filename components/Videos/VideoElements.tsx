import { RefObject } from "react";

type VideoElementsProps = {
  videos: Videos;
};

type Videos = {
  ice: RefObject<HTMLVideoElement>;
  upperCube: RefObject<HTMLVideoElement>;
  lowerCube: RefObject<HTMLVideoElement>;
  a7: RefObject<HTMLVideoElement>;
  yttreOval: RefObject<HTMLVideoElement>;
};

export const VideoElements = (props: VideoElementsProps) => {
  const { ice, upperCube, a7, lowerCube } = props.videos;
  return (
    <>
      <video
        ref={ice}
        style={{ display: "none" }}
        loop={false}
        muted={false}
        playsInline={true}
        crossOrigin="anonymous"
        src={process.env.NEXT_PUBLIC_ICE_URL}
      ></video>

      <video
        ref={upperCube}
        style={{ display: "none" }}
        loop={false}
        muted={true}
        playsInline={true}
        crossOrigin="anonymous"
        src={process.env.NEXT_PUBLIC_UPPER_CUBE_URL}
      ></video>

      <video
        ref={lowerCube}
        style={{ display: "none" }}
        loop={false}
        muted={true}
        playsInline={true}
        crossOrigin="anonymous"
        src={process.env.NEXT_PUBLIC_LOWER_CUBE_URL}
      ></video>

      <video
        ref={a7}
        style={{ display: "none" }}
        loop={false}
        muted={true}
        playsInline={true}
        crossOrigin="anonymous"
        src={process.env.NEXT_PUBLIC_A7_URL}
      ></video>
    </>
  );
};
