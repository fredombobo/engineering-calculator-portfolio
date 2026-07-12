'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import type { Work } from '@/lib/works';

export default function WorkCard({ work, index = 0 }: { work: Work; index?: number }) {
  const locale = useLocale();
  const { frontmatter } = work;
  const title = locale === 'zh' ? frontmatter.title.zh : frontmatter.title.en;
  const description = locale === 'zh' ? frontmatter.description.zh : frontmatter.description.en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={`/${locale}/works/${work.slug}`}>
        <motion.div
          className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-all duration-300"
          whileHover={{ y: -6, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.15)' }}
        >
          {/* Thumbnail area */}
          <div className="aspect-video bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 relative overflow-hidden">
            {frontmatter.thumbnail ? (
              <img src={frontmatter.thumbnail} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-black text-indigo-300/40 dark:text-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                  {title.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4">
              {description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {frontmatter.tags.slice(0, 4).map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  {tag}
                </span>
              ))}
              {frontmatter.tags.length > 4 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs text-zinc-400">
                  +{frontmatter.tags.length - 4}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
