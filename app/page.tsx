'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Track } from './types';
import TrackCard from './components/TrackCard';
import { getAlbumCover } from './utils';

export default function Home() {
    const [round, setRound] = useState<Track[]>([]);
    const [currentMatchup, setCurrentMatchup] = useState<[Track, Track] | null>(null);
    const [nextRound, setNextRound] = useState<Track[]>([]);
    const [winner, setWinner] = useState<Track | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/madonna')
            .then(res => {
                if (!res.ok) throw new Error(`API Error: ${res.status}`);
                return res.json();
            })
            .then((data: Track[]) => {
                const shuffled = [...data].sort(() => 0.5 - Math.random());
                setRound(shuffled);
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setError('Failed to load Madonna tracks. Please try again later.');
            });
    }, []);

    useEffect(() => {
        if (round.length >= 2) {
            setCurrentMatchup([round[0], round[1]]);
        } else if (round.length === 1) {
            setNextRound(prev => [...prev, round[0]]);
            setRound([]);
        } else if (nextRound.length === 1) {
            setWinner(nextRound[0]);
        } else if (nextRound.length > 1) {
            setRound(nextRound);
            setNextRound([]);
        }
    }, [round, nextRound]);

    useEffect(() => {
        if (winner) {
            fetch('/api/scoreboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: winner.name,
                    albumCover: winner.albumCover,
                }),
            }).catch(err => console.error('Failed to update scoreboard:', err));
        }
    }, [winner]);

    const vote = (track: Track) => {
        setNextRound(prev => [...prev, track]);
        setRound(prev => prev.slice(2));
    };

    return (
        <div className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-6">🎤 Battle of the Hits: Madonna Edition</h1>

            <p className="mb-4 text-sm text-blue-600 underline">
                <Link href="/scoreboard">View the Scoreboard</Link>
            </p>

            {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

            {winner ? (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold">🏆 Ultimate Winner: {winner.name}</h2>
                    <Image
                        src={getAlbumCover(winner.albumCover)}
                        alt={winner.name}
                        width={208}
                        height={208}
                        className="mx-auto mt-4 rounded-md object-cover"
                    />
                </div>
            ) : currentMatchup ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentMatchup.map((track, i) => (
                        <TrackCard key={i} track={track} onVote={() => vote(track)} />
                    ))}
                </div>
            ) : (
                <p className="text-lg text-gray-600">Preparing next battle...</p>
            )}
        </div>
    );
}
