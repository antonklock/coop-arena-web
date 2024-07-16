const stopVideo = (props: {
    iceVideoRef: React.RefObject<HTMLVideoElement>;
    bigmapVideoRef: React.RefObject<HTMLVideoElement>;
    yttreOvalVideoRef: React.RefObject<HTMLVideoElement>;
    setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { iceVideoRef, bigmapVideoRef, yttreOvalVideoRef, setPlaying } = props
    if (
        iceVideoRef.current &&
        bigmapVideoRef.current &&
        yttreOvalVideoRef.current
    ) {
        iceVideoRef.current.pause();
        iceVideoRef.current.currentTime = 0;

        bigmapVideoRef.current.pause();
        bigmapVideoRef.current.currentTime = 0;

        yttreOvalVideoRef.current.pause();
        yttreOvalVideoRef.current.currentTime = 0;

        setPlaying(false);
        console.log("Stop intro");
    }
};

export default stopVideo;