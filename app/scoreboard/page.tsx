'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ScoreEntry } from '../types';
import { getAlbumCover } from '../utils';

export default function ScoreboardPage() {
    const [scores, setScores] = useState<ScoreEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/scoreboard')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch scores.');
                return res.json();
            })
            .then(data => setScores(data))
            .catch(err => {
                console.error('Scoreboard fetch error:', err);
                setError('Unable to load scoreboard. Please try again later.');
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-6">🏆 All-Time Scoreboard</h1>

            {/* Error */}
            {error && <p className="text-red-600 font-semibold mb-6">{error}</p>}

            {/* Loading */}
            {loading && !error && (
                <p className="text-gray-500 text-lg mb-6">Loading scoreboard...</p>
            )}

            {/* Scoreboard */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {scores.map((track, idx) => (
                        <div
                            key={idx}
                            className="border p-4 rounded-lg shadow hover:shadow-md transition text-center"
                        >
                            <h2 className="text-xl font-semibold mb-2">
                                {idx + 1}. {track.name}
                            </h2>
                            <Image
                                src={getAlbumCover(track.albumCover)}
                                alt={track.name}
                                width={160}
                                height={160}
                                className="mx-auto mb-3 object-cover rounded-md"
                            />
                            <p className="text-lg font-medium">
                                {track.wins} win{track.wins !== 1 ? 's' : ''}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Back link */}
            <p className="mt-10 text-sm text-blue-600 underline">
                <Link href="/">← Back to Main Page</Link>
            </p>
        </div>
    );
}
