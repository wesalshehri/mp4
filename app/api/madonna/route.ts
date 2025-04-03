import { NextResponse } from 'next/server';
import { Track } from '../../types';

type LastFmTrack = {
    name: string;
    artist: {
        name: string;
    };
};

export async function GET() {
    const apiKey = process.env.LASTFM_API_KEY;
    const topTracksURL = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=madonna&api_key=${apiKey}&format=json`;

    try {
        const res = await fetch(topTracksURL);
        const data = await res.json();
        const topTracks: LastFmTrack[] = data.toptracks.track.slice(0, 10);

        const enrichedTracks: Track[] = await Promise.all(
            topTracks.map(async (track): Promise<Track> => {
                const trackInfoURL = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(
                    track.artist.name
                )}&track=${encodeURIComponent(track.name)}&format=json`;

                let albumCover: string | undefined;

                try {
                    const trackInfoRes = await fetch(trackInfoURL);
                    if (trackInfoRes.ok) {
                        const trackInfo = await trackInfoRes.json();
                        albumCover = trackInfo.track?.album?.image?.[3]?.['#text'];
                    }
                } catch {
                    albumCover = undefined;
                }

                return {
                    name: track.name,
                    albumCover,
                };
            })
        );

        return NextResponse.json(enrichedTracks);
    } catch (error) {
        console.error('Error fetching top tracks:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
