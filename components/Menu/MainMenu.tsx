import PlayIntroButton from "../PlayIntroButton";
import playVideo from "../../utils/video/playVideo";
import stopVideo from "../../utils/video/stopVideo";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

type MainMenuProps = {
  videos: Videos;
  introAnimDone: boolean;
  playing: boolean;
  setPlaying: Dispatch<SetStateAction<boolean>>;
  animOrbit: MutableRefObject<boolean>;
  setShowSettings: (showSettings: boolean) => void;
  showSettings: boolean;
  handleUnload: () => void;
};

export const MainMenu = (props: MainMenuProps) => {
  const {
    introAnimDone,
    playing,
    videos,
    setPlaying,
    animOrbit,
    setShowSettings,
    showSettings,
    handleUnload,
  } = props;
  return (
    <>
      <div className="flex flex-col justify-start m-4 bg-black rounded-xl">
        <PlayIntroButton
          introAnimDone={introAnimDone}
          playing={playing}
          playVideo={() =>
            playVideo({
              iceVideoRef: videos.ice.ref,
              bigmapVideoRef: videos.bigMap.ref,
              yttreOvalVideoRef: videos.yttreOval.ref,
              setPlaying,
            })
          }
          stopVideo={() =>
            stopVideo({
              iceVideoRef: videos.ice.ref,
              bigmapVideoRef: videos.bigMap.ref,
              yttreOvalVideoRef: videos.yttreOval.ref,
              setPlaying,
            })
          }
        />

        <button
          style={{
            backgroundColor: "blue",
            color: "white",
            paddingRight: 4,
            paddingLeft: 4,
            paddingTop: 2,
            paddingBottom: 2,
            borderRadius: 4,
            marginTop: 4,
          }}
          onClick={() => (animOrbit.current = !animOrbit.current)}
        >
          {animOrbit.current ? "Release camera" : "Orbit animation"}
        </button>
        <button
          style={{
            backgroundColor: "blue",
            color: "white",
            paddingRight: 4,
            paddingLeft: 4,
            paddingTop: 2,
            paddingBottom: 2,
            borderRadius: 4,
            marginTop: 4,
          }}
          onClick={() => setShowSettings(!showSettings)}
        >
          Settings
        </button>
        <button
          style={{
            backgroundColor: "blue",
            color: "white",
            paddingRight: 4,
            paddingLeft: 4,
            paddingTop: 2,
            paddingBottom: 2,
            borderRadius: 4,
            marginTop: 4,
          }}
          onClick={handleUnload}
        >
          Unload arena
        </button>
      </div>
    </>
  );
};
