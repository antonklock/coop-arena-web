import PlayIntroButton from "../PlayIntroButton";
import playVideo from "../../utils/video/playVideo";
import stopVideo from "../../utils/video/stopVideo";
import { Dispatch, MutableRefObject, SetStateAction, use } from "react";
import { useThreeSceneStore } from "@/stores/ThreeSceneStore";

type MainMenuProps = {
  videos: Videos;
  playing: boolean;
  setPlaying: Dispatch<SetStateAction<boolean>>;
  setShowSettings: (showSettings: boolean) => void;
  showSettings: boolean;
  handleUnload: () => void;
};

export const MainMenu = (props: MainMenuProps) => {
  const {
    playing,
    videos,
    setPlaying,
    setShowSettings,
    showSettings,
    handleUnload,
  } = props;

  const { animOrbit } = useThreeSceneStore();

  return (
    <>
      <div className="flex flex-col justify-start m-4 bg-black rounded-xl">
        <PlayIntroButton
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
          onClick={() => (useThreeSceneStore.getState().animOrbit = !animOrbit)}
        >
          {useThreeSceneStore.getState().animOrbit
            ? "Release camera"
            : "Orbit animation"}
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
