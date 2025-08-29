const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'https://dr-serzhans-psycare.onrender.com';

console.log('Using PAYLOAD_API_URL:', PAYLOAD_API_URL);


export interface BlogPost {
  id: string;
  title: string;
  content: string | object; // Can be either HTML string or Lexical object
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
    if (!PAYLOAD_API_URL) {
      console.log('PAYLOAD_API_URL not configured, returning empty array');
      return [];
    }

    console.log('Fetching from:', `${PAYLOAD_API_URL}/api/posts`);
    
    const response = await fetch(`${PAYLOAD_API_URL}/api/posts?where[status][equals]=published&sort=-publishedDate&depth=2`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Important for SSG - fetch fresh data at build time
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    return data.docs || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    if (!PAYLOAD_API_URL) {
      return null;
    }

    const response = await fetch(`${PAYLOAD_API_URL}/api/posts?where[slug][equals]=${slug}`, {
      headers: {
        'Content-Type': 'application/json',
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