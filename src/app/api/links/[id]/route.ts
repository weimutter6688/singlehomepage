import { NextRequest, NextResponse } from 'next/server';
import { deleteLink } from '@/lib/data';

// DELETE /api/links/[id] - Delete a link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication is now handled by middleware
    const resolvedParams = await params;
    if (!resolvedParams.id) {
      return NextResponse.json(
        { error: 'Link ID is required' },
        { status: 400 }
      );
    }
    
    const success = await deleteLink(resolvedParams.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to delete link' },
      { status: 500 }
    );
  }
}