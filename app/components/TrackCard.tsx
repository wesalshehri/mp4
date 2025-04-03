'use client';

import { Track } from '../types';
import { getAlbumCover } from '../utils';
import Image from 'next/image';

export default function TrackCard({
                                      track,
                                      onVote,
                                  }: {
    track: Track;
    onVote: () => void;
}) {
    return (
        <div className="border p-4 rounded-lg shadow hover:shadow-lg transition text-center">
            <h2 className="text-xl font-semibold mb-2">{track.name}</h2>

            <Image
                src={getAlbumCover(track.albumCover)}
                alt={track.name}
                width={192}
                height={192}
                className="mx-auto mb-2 rounded-md object-cover"
            />


            <p className="text-gray-600 text-sm mt-2">
                 {Number(track.playcount).toLocaleString()} plays
            </p>

            <button
                className="mt-3 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
                onClick={onVote}
            >
                Vote
            </button>
        </div>
    );
}
