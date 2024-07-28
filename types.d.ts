// Add global scope
export declare global {
    interface Videos {
        ice: ArenaVideo;
        upperCube: ArenaVideo;
        a7: ArenaVideo;
        bigMap: ArenaVideo;
        yttreOval: ArenaVideo;
    };
}

type ArenaVideo = {
    url: string;
    ref: React.RefObject<HTMLVideoElement>;
};