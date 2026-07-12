'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import type { Work } from '@/lib/works';
import WorkCard from '@/components/works/WorkCard';

export default function FeaturedWorks({ works }: { works: Work[] }) {
  const t = useTranslations('home');
  const locale = useLocale();
  const featured = works.filter(w => w.frontmatter.featured);

  if (featured.length === 0) return null;

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-zinc-900 dark:text-white"
          >
            {t('featuredWorks')}
          </motion.h2>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Link
              href={`/${locale}/works`}
              className="text-sm font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 transition-colors"
            >
              {t('viewAll')} →
            </Link>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((work, i) => (
            <WorkCard key={work.slug} work={work} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
