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

// Fetch all blog posts - no API key
export async function getAllPosts(): Promise<BlogPost[]> {
  if (!PAYLOAD_API_URL) {
    console.warn('PAYLOAD_API_URL not configured, returning empty array');
    return [];
  }

  try {
    const url = `${PAYLOAD_API_URL}/api/posts`;
    console.log('Fetching from:', url);
    
    const response = await fetch(url, {
      // No Authorization header needed
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    console.log('Fetched posts:', data.docs?.length || 0);
    return data.docs || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// Fetch a single post by slug - no API key
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!PAYLOAD_API_URL) {
    console.warn('PAYLOAD_API_URL not configured');
    return null;
  }

  try {
    const url = `${PAYLOAD_API_URL}/api/posts?where[slug][equals]=${slug}`;
    console.log('Fetching post:', url);
    
    const response = await fetch(url, {
      // No Authorization header needed
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Failed to fetch post: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}