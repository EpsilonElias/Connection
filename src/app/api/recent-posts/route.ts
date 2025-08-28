
import { getAllPosts } from '@/lib/payload';
import { NextResponse } from 'next/server';

// Helper to convert Lexical JSON to HTML (minimal, for demo)
/* eslint-disable @typescript-eslint/no-explicit-any */
function lexicalToHtml(content: any): string {
  if (!content || !content.root || !Array.isArray(content.root.children)) return '';
  return content.root.children.map((node: any) => {
    if (node.type === 'paragraph') {
      const content = (node.children || []).map((child: any) => {
        if (child.text) {
          return child.text;
        } else if (child.type === 'upload') {
          // Handle image uploads within paragraphs
          let src = child.value?.url || (typeof child.src === 'string' ? child.src : '');
          const alt = child.value?.alt || child.alt || 'Image';
          
          if (src) {
            // Ensure absolute URL
            if (!src.startsWith('http')) {
              const baseUrl = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'https://dr-serzhans-psycare.onrender.com';
              src = src.startsWith('/') ? `${baseUrl}${src}` : `${baseUrl}/${src}`;
            }
            return `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; display: block; margin: 20px 0;" />`;
          }
          return '';
        } else if (child.type === 'image') {
          // Handle direct image nodes within paragraphs
          let src = child.src || child.url || '';
          const alt = child.alt || child.altText || 'Image';
          
          if (src) {
            // Ensure absolute URL
            if (!src.startsWith('http')) {
              const baseUrl = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'https://dr-serzhans-psycare.onrender.com';
              src = src.startsWith('/') ? `${baseUrl}${src}` : `${baseUrl}/${src}`;
            }
            return `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; display: block; margin: 20px 0;" />`;
          }
          return '';
        }
        return '';
      }).join('');
      return content ? `<p>${content}</p>` : '';
    } else if (node.type === 'upload') {
      // Handle image uploads within content
      let src = node.value?.url || (typeof node.src === 'string' ? node.src : '');
      const alt = node.value?.alt || node.alt || 'Image';
      
      if (src) {
        // Ensure absolute URL
        if (!src.startsWith('http')) {
          const baseUrl = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'https://dr-serzhans-psycare.onrender.com';
          src = src.startsWith('/') ? `${baseUrl}${src}` : `${baseUrl}/${src}`;
        }
        return `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; display: block; margin: 20px 0;" />`;
      }
      return '';
    } else if (node.type === 'image') {
      // Handle direct image nodes
      let src = node.src || node.url || '';
      const alt = node.alt || node.altText || 'Image';
      
      if (src) {
        // Ensure absolute URL
        if (!src.startsWith('http')) {
          const baseUrl = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'https://dr-serzhans-psycare.onrender.com';
          src = src.startsWith('/') ? `${baseUrl}${src}` : `${baseUrl}/${src}`;
        }
        return `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; display: block; margin: 20px 0;" />`;
      }
      return '';
    }
    return '';
  }).join('');
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function GET() {
  try {
    const posts = await getAllPosts();
    const recentPosts = posts.slice(0, 5).map(post => {
      // Process featured image URL - ensure we have the full URL
      let featuredImageUrl = '';
      if (post.featuredImage) {
        if (typeof post.featuredImage === 'string') {
          featuredImageUrl = post.featuredImage;
        } else if (post.featuredImage.url) {
          // Ensure full URL
          featuredImageUrl = post.featuredImage.url.startsWith('http') 
            ? post.featuredImage.url 
            : `${process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'https://dr-serzhans-psycare.onrender.com'}${post.featuredImage.url}`;
        }
      }
      
      return {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || post.title,
        content: typeof post.content === 'string' ? post.content : lexicalToHtml(post.content),
        publishedDate: post.publishedDate,
        featuredImage: featuredImageUrl
      };
    });
    return NextResponse.json({ posts: recentPosts });
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return NextResponse.json({ posts: [], error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export const dynamic = 'force-static';
