'use server';

import { NextResponse } from 'next/server';
import { toggleLinkStar } from '@/lib/star';

export async function POST(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Missing link id' }, { status: 400 });
        }

        const updatedLink = await toggleLinkStar(id);

        if (!updatedLink) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        return NextResponse.json(updatedLink);
    } catch (error) {
        console.error('Error toggling star:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}