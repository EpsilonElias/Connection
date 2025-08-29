#!/usr/bin/env tsx

import 'dotenv/config';
import { writeFileSync } from 'fs';
import { join } from 'path';

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || 'https://dr-serzhans-psycare.onrender.com';

console.log('Using PAYLOAD_API_URL:', PAYLOAD_API_URL);

// Function to convert Lexical content to HTML
function lexicalToHtml(content: any): string {
  if (!content || !content.children) return '';
  
  return content.children.map((node: any) => {
    if (node.type === 'paragraph') {
      const content = node.children.map((child: any) => {
        if (child.type === 'text') {
          return child.text || '';
        } else if (child.type === 'upload') {
          // Handle image uploads within paragraphs - NO PROXY
          let src = child.value?.url || (typeof child.src === 'string' ? child.src : '');
          const alt = child.value?.alt || child.alt || 'Image';
          
          if (src) {
            // Ensure absolute URL
            if (!src.startsWith('http')) {
              const baseUrl = PAYLOAD_API_URL;
              src = src.startsWith('/') ? `${baseUrl}${src}` : `${baseUrl}/${src}`;
            }
            
            // Use DIRECT URL - no proxy
            return `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; display: block; margin: 20px 0;" />`;
          }
          return '';
        } else if (child.type === 'image') {
          // Handle direct image nodes within paragraphs - NO PROXY
          let src = child.src || child.url || '';
          const alt = child.alt || child.altText || 'Image';
          
          if (src) {
            // Ensure absolute URL
            if (!src.startsWith('http')) {
              const baseUrl = PAYLOAD_API_URL;
              src = src.startsWith('/') ? `${baseUrl}${src}` : `${baseUrl}/${src}`;
            }
            
            // Use DIRECT URL - no proxy
            return `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; display: block; margin: 20px 0;" />`;
          }
          return '';
        }
        return '';
      }).join('');
      return content ? `<p>${content}</p>` : '';
    } else if (node.type === 'upload') {
      // Handle upload nodes at the root level - NO PROXY
      let src = node.value?.url || (typeof node.src === 'string' ? node.src : '');
      const alt = node.value?.alt || node.alt || 'Image';
      
      if (src) {
        // Ensure absolute URL
        if (!src.startsWith('http')) {
          const baseUrl = PAYLOAD_API_URL;
          src = src.startsWith('/') ? `${baseUrl}${src}` : `${baseUrl}/${src}`;
        }
        
        // Use DIRECT URL - no proxy
        return `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; display: block; margin: 20px 0;" />`;
      }
      return '';
    } else if (node.type === 'image') {
      // Handle image nodes at the root level - NO PROXY
      let src = node.src || node.url || '';
      const alt = node.alt || node.altText || 'Image';
      
      if (src) {
        // Ensure absolute URL
        if (!src.startsWith('http')) {
          const baseUrl = PAYLOAD_API_URL;
          src = src.startsWith('/') ? `${baseUrl}${src}` : `${baseUrl}/${src}`;
        }
        
        // Use DIRECT URL - no proxy
        return `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; display: block; margin: 20px 0;" />`;
      }
      return '';
    } else if (node.type === 'heading') {
      const level = node.tag || 'h1';
      const text = node.children?.map((child: any) => child.text || '').join('') || '';
      return `<${level}>${text}</${level}>`;
    } else if (node.type === 'list') {
      const listType = node.listType === 'number' ? 'ol' : 'ul';
      const items = node.children?.map((item: any) => {
        const itemText = item.children?.map((child: any) => {
          if (child.type === 'text') return child.text || '';
          return '';
        }).join('') || '';
        return `<li>${itemText}</li>`;
      }).join('') || '';
      return `<${listType}>${items}</${listType}>`;
    }
    return '';
  }).join('');
}

async function generateBlogsJson() {
  try {
    console.log('Environment check:');
    console.log('PAYLOAD_API_URL:', process.env.PAYLOAD_API_URL);
    console.log('NEXT_PUBLIC_PAYLOAD_API_URL:', process.env.NEXT_PUBLIC_PAYLOAD_API_URL);

    const apiUrl = `${PAYLOAD_API_URL}/api/posts`;
    console.log('Fetching from:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    const blogs = data.docs?.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      publishedDate: post.publishedDate || post.createdAt,
      featuredImage: post.featuredImage?.url ? 
        (post.featuredImage.url.startsWith('http') ? 
          post.featuredImage.url : 
          `${PAYLOAD_API_URL}${post.featuredImage.url}`) : '',
      contentHtml: lexicalToHtml(post.content)
    })) || [];

    const outputDir = process.cwd();
    const publicPath = join(outputDir, 'public', 'blogs.json');
    const outPath = join(outputDir, 'out', 'blogs.json');
    
    writeFileSync(publicPath, JSON.stringify(blogs, null, 2));
    writeFileSync(outPath, JSON.stringify(blogs, null, 2));
    
    console.log(`blogs.json generated with ${blogs.length} posts in both public and out directories.`);
    
  } catch (error) {
    console.error('Error generating blogs.json:', error);
    process.exit(1);
  }
}

generateBlogsJson();
