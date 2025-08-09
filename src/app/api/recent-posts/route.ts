import { getAllPosts } from '@/lib/payload';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const posts = await getAllPosts();
    
    // Return the 5 most recent posts with minimal data for preview
    const recentPosts = posts.slice(0, 5).map(post => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || post.title,
      publishedDate: post.publishedDate,
      author: post.author
    }));
    
    return NextResponse.json({
      posts: recentPosts,
      total: posts.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return NextResponse.json({ 
      posts: [], 
      total: 0, 
      error: 'Failed to fetch posts' 
    }, { status: 500 });
  }
}

// This route will be statically generated at build time
export const dynamic = 'force-static';
