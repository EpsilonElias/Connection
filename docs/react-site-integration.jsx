// Example integration for your main React site
// This shows how to link to your blog from your main site

import React from 'react';

const BlogLink = () => {
  // Replace with your actual GitHub Pages URL
  const blogUrl = 'https://epsilonelias.github.io/Connection'; // Or your custom domain
  
  return (
    <div className="blog-section">
      <h2>Latest from Our Blog</h2>
      <p>Stay updated with our latest insights and articles.</p>
      
      {/* Simple link to your static blog */}
      <a 
        href={blogUrl}
        target="_blank" 
        rel="noopener noreferrer"
        className="blog-cta-button"
      >
        Visit Our Blog →
      </a>
      
      {/* Or you could fetch and display recent posts */}
      <BlogPreview blogUrl={blogUrl} />
    </div>
  );
};

// Optional: Fetch recent posts for preview (client-side)
const BlogPreview = ({ blogUrl }) => {
  const [recentPosts, setRecentPosts] = React.useState([]);
  
  React.useEffect(() => {
    // You could fetch from your API or use a JSON feed
    fetch(`${blogUrl}/api/recent-posts.json`) // You'd need to generate this
      .then(res => res.json())
      .then(posts => setRecentPosts(posts.slice(0, 3)))
      .catch(err => console.log('Blog preview not available'));
  }, [blogUrl]);
  
  return (
    <div className="blog-preview">
      {recentPosts.map(post => (
        <div key={post.slug} className="blog-preview-item">
          <h3>
            <a href={`${blogUrl}/posts/${post.slug}`} target="_blank" rel="noopener noreferrer">
              {post.title}
            </a>
          </h3>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  );
};

export default BlogLink;
