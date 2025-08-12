
import { getAllPosts } from '@/lib/payload';
import { NextResponse } from 'next/server';

// Helper to convert Lexical JSON to HTML (minimal, for demo)
/* eslint-disable @typescript-eslint/no-explicit-any */
function lexicalToHtml(content: any): string {
  if (!content || !content.root || !Array.isArray(content.root.children)) return '';
  return content.root.children.map((node: any) => {
    if (node.type === 'paragraph') {
      return `<p>${(node.children || []).map((child: any) => child.text || '').join('')}</p>`;
    }
    return '';
  }).join('');
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function GET() {
  try {
    const posts = await getAllPosts();
    const recentPosts = posts.slice(0, 5).map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || post.title,
      content: typeof post.content === 'string' ? post.content : lexicalToHtml(post.content),
      publishedDate: post.publishedDate
    }));
    return NextResponse.json({ posts: recentPosts });
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return NextResponse.json({ posts: [], error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export const dynamic = 'force-static';
