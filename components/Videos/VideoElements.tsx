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
  const { ice, upperCube, a7, lowerCube, yttreOval } = props.videos;
  return (
    <>
      <video
        ref={ice}
        style={{
          display: "block",
          zIndex: "999",
          width: 200,
          height: "auto",
          position: "absolute",
          left: 10,
          bottom: 10,
          outline: "1px solid #031f52",
        }}
        loop={false}
        muted={false}
        playsInline={true}
        crossOrigin="anonymous"
        src={process.env.NEXT_PUBLIC_ICE_URL}
      ></video>
      <video
        ref={upperCube}
        style={{
          display: "block",
          zIndex: "999",
          width: 200,
          height: "auto",
          position: "absolute",
          left: 10,
          bottom: 150,
          outline: "1px solid #402203",
        }}
        loop={false}
        muted={true}
        playsInline={true}
        crossOrigin="anonymous"
        src={process.env.NEXT_PUBLIC_UPPER_CUBE_URL}
      ></video>
      <video
        ref={lowerCube}
        style={{
          display: "block",
          zIndex: "999",
          width: 200,
          height: "auto",
          position: "absolute",
          left: 10,
          bottom: 120,
          outline: "1px solid #402203",
        }}
        loop={false}
        muted={true}
        playsInline={true}
        crossOrigin="anonymous"
        src={process.env.NEXT_PUBLIC_LOWER_CUBE_URL}
      ></video>
      <video
        ref={a7}
        style={{
          display: "block",
          zIndex: "999",
          width: 800,
          height: "auto",
          position: "absolute",
          left: 220,
          bottom: 10,
          outline: "1px solid #0b5203",
        }}
        loop={false}
        muted={true}
        playsInline={true}
        crossOrigin="anonymous"
        src={process.env.NEXT_PUBLIC_A7_URL}
      ></video>
      <video
        ref={yttreOval}
        style={{
          display: "block",
          zIndex: "999",
          width: 800,
          height: "auto",
          position: "absolute",
          left: 220,
          bottom: 40,
          outline: "1px solid #750e72",
        }}
        loop={false}
        muted={true}
        playsInline={true}
        crossOrigin="anonymous"
        src={process.env.NEXT_PUBLIC_YTTRE_OVAL_URL}
      ></video>
    </>
  );
};
