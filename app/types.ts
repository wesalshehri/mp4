export type Track = {
    name: string;
    albumCover?: string;
    playcount: string;
};

export type ScoreEntry = Track & {
    wins: number;
};
