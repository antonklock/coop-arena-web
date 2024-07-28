import { Dispatch, MutableRefObject, SetStateAction, useState } from "react";
import { SettingsMenu } from "../SettingsMenu";
import { MainMenu } from "./MainMenu";
import { MenuButton } from "./MenuButton";

type MenuProps = {
  setVideoUrls: (ice: string, upperCube: string, a7: string) => void;
  videos: Videos;
  introAnimDone: boolean;
  playing: boolean;
  setPlaying: Dispatch<SetStateAction<boolean>>;
  animOrbit: MutableRefObject<boolean>;
  handleUnload: () => void;
};

export const Menu = (props: MenuProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const {
    setVideoUrls,
    introAnimDone,
    playing,
    setPlaying,
    videos,
    animOrbit,
    handleUnload,
  } = props;
  return (
    <>
      <div className="absolute top-[2%] right-[2%]">
        <div
          className="flex flex-col w-40 h-auto justify-center items-end"
          style={
            showMenu ? { backgroundColor: "#121212", borderRadius: 10 } : {}
          }
        >
          <MenuButton showMenu={showMenu} setShowMenu={setShowMenu} />
          {showMenu && (
            <MainMenu
              introAnimDone={introAnimDone}
              playing={playing}
              videos={videos}
              setPlaying={setPlaying}
              animOrbit={animOrbit}
              setShowSettings={setShowSettings}
              showSettings={showSettings}
              handleUnload={handleUnload}
            />
          )}
        </div>
      </div>

      <SettingsMenu
        setShowMenu={setShowSettings}
        showMenu={showSettings}
        setUrls={setVideoUrls}
        currentA7Url={videos.a7.url}
        currentIceUrl={videos.ice.url}
        currentUpperCubeUrl={videos.upperCube.url}
      />
    </>
  );
};
