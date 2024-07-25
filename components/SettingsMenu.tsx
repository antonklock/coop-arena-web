"use client";

import React, { useState } from "react";

type SettingsMenuProps = {
  setUrls: (ice: string, upperCube: string, a7: string) => void;
  currentIceUrl: string;
  currentUpperCubeUrl: string;
  currentA7Url: string;
  showMenu: boolean;
  setShowMenu: (showMenu: boolean) => void;
};

const SettingsMenu = (props: SettingsMenuProps) => {
  const {
    setUrls,
    currentIceUrl,
    currentA7Url,
    currentUpperCubeUrl,
    showMenu,
    setShowMenu,
  } = props;

  const [iceUrl, setIceUrl] = useState("");
  const [upperCubeUrl, setUpperCubeUrl] = useState("");
  const [a7Url, setA7Url] = useState("");
  const [settingsSaved, setSettingsSaved] = useState(false);
  return (
    <>
      {showMenu ? (
        <div style={bgStyle}>
          <button
            style={{ ...buttonStyle, backgroundColor: "red" }}
            onClick={() => {
              setShowMenu(false);
              setSettingsSaved(false);
            }}
          >
            Close settings
          </button>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <label htmlFor="iceVideoTextInput">Ice video url: </label>
            <input
              style={{
                color: "black",
                borderRadius: 5,
                width: 400,
                backgroundColor: "lightblue",
              }}
              name="iceVideoTextInput"
              type={"text"}
              placeholder={currentIceUrl}
              onChange={(e) => {
                setIceUrl(e.target.value);
                setSettingsSaved(false);
              }}
            ></input>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <label htmlFor="upperCubeVideoTextInput">
              Upper cube video url:
            </label>
            <input
              style={{
                color: "black",
                borderRadius: 5,
                width: 400,
                backgroundColor: "lightblue",
              }}
              name="upperCubeVideoTextInput"
              type={"text"}
              placeholder={currentUpperCubeUrl}
              onChange={(e) => {
                setUpperCubeUrl(e.target.value);
                setSettingsSaved(false);
              }}
            ></input>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <label htmlFor="a7VideoTextInput">A7 video url: </label>
            <input
              style={{
                color: "black",
                borderRadius: 5,
                width: 400,
                backgroundColor: "lightblue",
              }}
              name="a7VideoTextInput"
              type={"text"}
              placeholder={currentA7Url}
              onChange={(e) => {
                setA7Url(e.target.value);
                setSettingsSaved(false);
              }}
            ></input>
          </div>
          {settingsSaved ? (
            <button style={{ ...buttonStyle, backgroundColor: "green" }}>
              Settings saved
            </button>
          ) : (
            <button
              onClick={() => {
                setSettingsSaved(true);
                setUrls(iceUrl, upperCubeUrl, a7Url);
              }}
              style={buttonStyle}
            >
              Save settings
            </button>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

const buttonStyle = {
  backgroundColor: "blue",
  paddingTop: 4,
  paddingRight: 2,
  paddingBottom: 4,
  paddingLeft: 2,
  borderRadius: 5,
};

const settingsButton: React.CSSProperties = {
  backgroundColor: "blue",
  paddingTop: 4,
  paddingRight: 2,
  paddingBottom: 4,
  paddingLeft: 2,
  borderRadius: 5,
  marginTop: 10,
};

const bgStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#121212",
  padding: 40,
  borderRadius: 15,
};

export { SettingsMenu };
