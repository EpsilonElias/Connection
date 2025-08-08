import { getPostBySlug, getAllPosts } from '@/lib/payload';
import { format } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Generate static params for all posts
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
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

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

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