const playVideo = (props: {
    iceVideoRef: React.RefObject<HTMLVideoElement>;
    bigmapVideoRef: React.RefObject<HTMLVideoElement>;
    yttreOvalVideoRef: React.RefObject<HTMLVideoElement>;
    setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { iceVideoRef, bigmapVideoRef, yttreOvalVideoRef, setPlaying } = props;
    if (
        iceVideoRef.current &&
        bigmapVideoRef.current &&
        yttreOvalVideoRef.current
    ) {
        iceVideoRef.current.play();
        bigmapVideoRef.current.play();
        yttreOvalVideoRef.current.play();

        setPlaying(true);
        console.log("Play intro");
    }
};

export default playVideo;