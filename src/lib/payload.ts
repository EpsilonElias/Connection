const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL;

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  publishedDate: string;
  author?: string;
  excerpt?: string;
  featuredImage?: {
    url: string;
    alt?: string;
  };
}

// Fetch all blog posts
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${PAYLOAD_API_URL}/api/posts`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY}`,
      },
      // Important for SSG - fetch fresh data at build time
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const data = await response.json();
    return data.docs || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${PAYLOAD_API_URL}/api/posts?where[slug][equals]=${slug}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY}`,
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`);
    }

    const data = await response.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Generate static paths for all posts
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}