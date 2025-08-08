import Link from 'next/link';
import { getAllPosts } from '@/lib/payload';
import { format } from 'date-fns';

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Psycare Blog</h1>
      
      {posts.length === 0 ? (
        <p className="text-center text-gray-600">No blog posts found.</p>
      ) : (
        <div className="grid gap-6 md:gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              {post.featuredImage && (
                <img 
                  src={post.featuredImage.url} 
                  alt={post.featuredImage.alt || post.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              
              <h2 className="text-2xl font-semibold mb-2">
                <Link href={`/posts/${post.slug}`} className="hover:text-blue-600 transition-colors">
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-gray-600 mb-4 text-sm">
                {format(new Date(post.publishedDate), 'MMMM d, yyyy')}
                {post.author && ` • By ${post.author}`}
              </p>
              
              {post.excerpt && (
                <p className="text-gray-700 mb-4">{post.excerpt}</p>
              )}
              
              <Link 
                href={`/posts/${post.slug}`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Read More
              </Link>
            </article>
          ))}
        </div>
      )}
      
      <div className="mt-8 text-center">
        <Link 
          href="https://your-main-react-site.com" 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Main Site
        </Link>
      </div>
    </div>
  );
}

// This enables static generation at build time
export const dynamic = 'force-static';