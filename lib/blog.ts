import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Locale } from './i18n';

const contentDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedDate: string;
  author: string;
  featuredImage?: string;
  tags: string[];
  category: string;
  content: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

const categories: Record<Locale, Category[]> = {
  fr: [
    { id: '1', name: 'Méditation', slug: 'meditation', color: '#46F2F4' },
    { id: '2', name: 'Spiritualité', slug: 'spiritualite', color: '#713FE3' },
    { id: '3', name: 'Thérapies Douces', slug: 'therapies-douces', color: '#87D322' },
    { id: '4', name: 'Psychologie', slug: 'psychologie', color: '#FF6B9D' },
    { id: '5', name: 'Astrosanté', slug: 'astrosante', color: '#FFA800' },
  ],
  de: [
    { id: '1', name: 'Meditation', slug: 'meditation', color: '#46F2F4' },
    { id: '2', name: 'Spiritualität', slug: 'spiritualite', color: '#713FE3' },
    { id: '3', name: 'Sanfte Therapien', slug: 'therapies-douces', color: '#87D322' },
    { id: '4', name: 'Psychologie', slug: 'psychologie', color: '#FF6B9D' },
    { id: '5', name: 'Astrogesundheit', slug: 'astrosante', color: '#FFA800' },
  ],
  en: [
    { id: '1', name: 'Meditation', slug: 'meditation', color: '#46F2F4' },
    { id: '2', name: 'Spirituality', slug: 'spiritualite', color: '#713FE3' },
    { id: '3', name: 'Gentle Therapies', slug: 'therapies-douces', color: '#87D322' },
    { id: '4', name: 'Psychology', slug: 'psychologie', color: '#FF6B9D' },
    { id: '5', name: 'Astro-Health', slug: 'astrosante', color: '#FFA800' },
  ],
};

export async function getBlogPosts(locale: Locale): Promise<BlogPost[]> {
  const blogDir = path.join(contentDirectory, locale);

  // Check if directory exists
  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const filenames = fs.readdirSync(blogDir);

  const posts = filenames
    .filter(filename => filename.endsWith('.mdx'))
    .map(filename => {
      const filePath = path.join(blogDir, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug: filename.replace('.mdx', ''),
        title: data.title,
        excerpt: data.excerpt,
        publishedDate: data.publishedDate,
        author: data.author,
        featuredImage: data.featuredImage,
        tags: data.tags || [],
        category: data.category,
        content,
      };
    })
    .sort((a, b) => {
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });

  return posts;
}

export async function getBlogPost(locale: Locale, slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(contentDirectory, locale, `${slug}.mdx`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      publishedDate: data.publishedDate,
      author: data.author,
      featuredImage: data.featuredImage,
      tags: data.tags || [],
      category: data.category,
      content,
    };
  } catch (error) {
    return null;
  }
}

export async function getCategories(locale: Locale): Promise<Category[]> {
  return categories[locale];
}
