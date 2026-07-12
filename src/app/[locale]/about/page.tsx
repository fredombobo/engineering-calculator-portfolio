import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import AboutClient from './AboutClient';

function getAboutData() {
  const filePath = path.join(process.cwd(), 'src', 'content', 'about.md');
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(raw);
  return data;
}

export default function AboutPage() {
  const data = getAboutData();
  return <AboutClient data={data} />;
}
