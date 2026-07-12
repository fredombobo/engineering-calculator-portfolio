import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface WorkFrontmatter {
  slug: string;
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  tags: string[];
  featured: boolean;
  date: string;
  thumbnail: string;
  demo_url?: string;
  github_url?: string;
  highlights: { zh: string[]; en: string[] };
  category?: string;
  gallery?: { src: string; caption: { zh: string; en: string } }[];
}

export interface Work {
  slug: string;
  frontmatter: WorkFrontmatter;
  content: string;
}

const worksDir = path.join(process.cwd(), 'src', 'content', 'works');

export function getAllWorks(): Work[] {
  if (!fs.existsSync(worksDir)) return [];
  
  const files = fs.readdirSync(worksDir).filter(f => f.endsWith('.md'));
  
  const works = files.map(filename => {
    const filePath = path.join(worksDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const slug = filename.replace('.md', '');
    
    return {
      slug,
      frontmatter: {
        slug,
        title: data.title || { zh: slug, en: slug },
        description: data.description || { zh: '', en: '' },
        tags: data.tags || [],
        featured: data.featured || false,
        date: data.date || '',
        thumbnail: data.thumbnail || '',
        demo_url: data.demo_url,
        github_url: data.github_url,
        highlights: data.highlights || { zh: [], en: [] },
        category: data.category,
        gallery: data.gallery || [],
      },
      content,
    };
  });
  
  return works.sort((a, b) => 
    new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
}

export function getWorkBySlug(slug: string): Work | null {
  return getAllWorks().find(w => w.slug === slug) || null;
}

export function getFeaturedWorks(): Work[] {
  return getAllWorks().filter(w => w.frontmatter.featured);
}

export function getAllTags(): string[] {
  const works = getAllWorks();
  const tagSet = new Set<string>();
  works.forEach(w => w.frontmatter.tags.forEach(t => tagSet.add(t)));
  return Array.from(tagSet).sort();
}
