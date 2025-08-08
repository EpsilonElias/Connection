import { getPostBySlug, getAllPosts } from '@/lib/payload';
import { format } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all posts
export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    console.log('Posts found:', posts.length); // Debug log
    
    if (!posts || posts.length === 0) {
      console.warn('No posts found, returning empty array');
      return [];
    }
    
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    // Return empty array to prevent build failure
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.title,
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← Back to Blog
        </Link>
      </nav>

      <article>
        {post.featuredImage && (
          <img 
            src={post.featuredImage.url} 
            alt={post.featuredImage.alt || post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
          />
        )}
        
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="text-gray-600 mb-8 text-sm">
          {format(new Date(post.publishedDate), 'MMMM d, yyyy')}
          {post.author && ` • By ${post.author}`}
        </div>
        
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
      
      <div className="mt-12 pt-8 border-t">
        <Link 
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          ← Back to All Posts
        </Link>
      </div>
    </div>
  );
}

// Enable static generation
export const dynamic = 'force-static';