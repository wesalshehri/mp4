export type Track = {
    name: string;
    albumCover?: string;
};

export type ScoreEntry = Track & {
    wins: number;
};
