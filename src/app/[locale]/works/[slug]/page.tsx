import { notFound } from 'next/navigation';
import { getWorkBySlug, getAllWorks } from '@/lib/works';
import { useLocale, useTranslations } from 'next-intl';
import type { Metadata } from 'next';
import WorkDetailClient from './WorkDetailClient';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) return { title: 'Not Found' };
  const title = locale === 'zh' ? work.frontmatter.title.zh : work.frontmatter.title.en;
  const description = locale === 'zh' ? work.frontmatter.description.zh : work.frontmatter.description.en;
  return { title: `${title} — Portfolio`, description };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);

  if (!work) notFound();

  const allWorks = getAllWorks();
  const related = allWorks.filter(w => w.slug !== slug).slice(0, 3);

  return <WorkDetailClient work={work} related={related} />;
}
