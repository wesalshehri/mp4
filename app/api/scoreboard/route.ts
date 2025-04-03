import { ScoreEntry } from '../../types';

type ScoreMap = {
    [trackName: string]: ScoreEntry;
};

const winCounts: ScoreMap = {};

export async function GET() {
    const sorted: ScoreEntry[] = Object.values(winCounts).sort(
        (a, b) => b.wins - a.wins
    );

    return Response.json(sorted);
}

export async function POST(req: Request) {
    const body: Partial<ScoreEntry> = await req.json();

    if (!body.name) {
        return new Response('Missing song name', { status: 400 });
    }

    const existing = winCounts[body.name];

    if (existing) {
        existing.wins += 1;
    } else {
        winCounts[body.name] = {
            name: body.name,
            albumCover: body.albumCover || '',
            wins: 1,
        };
    }

    return Response.json({ success: true, entry: winCounts[body.name] });
}
