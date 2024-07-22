type PlayIntroButtonProps = {
  playing: boolean;
  introAnimDone: boolean;
  playVideo: () => void;
  stopVideo: () => void;
};

const PlayIntroButton = (props: PlayIntroButtonProps) => {
  const { playing, playVideo, stopVideo, introAnimDone } = props;
  return (
    <>
      {!introAnimDone ? (
        <button
          disabled={true}
          style={{
            backgroundColor: "#444444",
            color: "darkgrey",
            padding: "2px 8px",
            borderRadius: "4px",
            margin: "10px",
            fontWeight: "bold",
          }}
        >
          PLAY INTRO
        </button>
      ) : (
        <>
          {playing ? (
            <button
              onClick={stopVideo}
              style={{
                backgroundColor: "#ff2222",
                color: "black",
                padding: "2px 8px",
                borderRadius: "4px",
                margin: "10px",
                fontWeight: "bold",
              }}
            >
              STOP INTRO
            </button>
          ) : (
            <button
              onClick={playVideo}
              style={{
                backgroundColor: "#22ff22",
                color: "black",
                padding: "2px 8px",
                borderRadius: "4px",
                margin: "10px",
                fontWeight: "bold",
              }}
            >
              PLAY INTRO
            </button>
          )}
        </>
      )}
    </>
  );
};

export default PlayIntroButton;
