type VideoElementsProps = {
  videos: Videos;
};

type Videos = {
  ice: {
    url: string;
    ref: any;
  };
  upperCube: {
    url: string;
    ref: any;
  };
  a7: {
    url: string;
    ref: any;
  };
};

export const VideoElements = (props: VideoElementsProps) => {
  const { ice, upperCube, a7 } = props.videos;
  return (
    <>
      <video
        ref={ice.ref}
        style={{ display: "none" }}
        loop={false}
        muted={false}
        playsInline={true}
        crossOrigin="anonymous"
        src={ice.url}
      ></video>

      <video
        ref={upperCube.ref}
        style={{ display: "none" }}
        loop={false}
        muted={true}
        playsInline={true}
        crossOrigin="anonymous"
        src={process.env.NEXT_PUBLIC_BIGMAP_URL}
      ></video>

      <video
        ref={a7.ref}
        style={{ display: "none" }}
        loop={false}
        muted={true}
        playsInline={true}
        crossOrigin="anonymous"
        src={process.env.NEXT_PUBLIC_YTTRE_OVAL_URL}
      ></video>
    </>
  );
};
