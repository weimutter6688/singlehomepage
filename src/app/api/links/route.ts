import { NextRequest, NextResponse } from 'next/server';
import { getLinks, addLink, updateLink } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';

// GET /api/links - Get all links
export async function GET(request: NextRequest) {
  try {
    // 获取所有链接
    const links = await getLinks();

    // 检查用户是否已认证
    const token = request.cookies.get('access_token')?.value;
    const userIsAuthenticated = await isAuthenticated(token);

    // 如果用户未认证，过滤掉私密链接
    const filteredLinks = userIsAuthenticated
      ? links
      : links.filter(link => !link.private);

    return NextResponse.json({ links: filteredLinks });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

// POST /api/links - Add a new link
export async function POST(request: NextRequest) {
  try {
    // Authentication is now handled by middleware
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.url || !data.categories || !data.categories.length) {
      return NextResponse.json(
        { error: 'Missing required fields: title, url, and at least one category are required' },
        { status: 400 }
      );
    }

    const newLink = await addLink({
      title: data.title,
      url: data.url,
      description: data.description,
      categories: data.categories,
      private: data.private || false
    });

    return NextResponse.json(newLink, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to add link' },
      { status: 500 }
    );
  }
}

// PUT /api/links - Update a link
export async function PUT(request: NextRequest) {
  try {
    // Authentication is now handled by middleware
    const data = await request.json();

    // Validate required fields
    if (!data.id || !data.title || !data.url || !data.categories || !data.categories.length) {
      return NextResponse.json(
        { error: 'Missing required fields: id, title, url, and at least one category are required' },
        { status: 400 }
      );
    }

    const updatedLink = await updateLink({
      id: data.id,
      title: data.title,
      url: data.url,
      description: data.description,
      categories: data.categories,
      private: data.private || false
    });

    if (!updatedLink) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedLink);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to update link' },
      { status: 500 }
    );
  }
}