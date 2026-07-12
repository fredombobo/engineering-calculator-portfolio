'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { FiExternalLink, FiGithub, FiArrowLeft, FiImage } from 'react-icons/fi';
import type { Work } from '@/lib/works';
import WorkCard from '@/components/works/WorkCard';

export default function WorkDetailClient({ work, related }: { work: Work; related: Work[] }) {
  const locale = useLocale();
  const t = useTranslations('works');
  const { frontmatter, content } = work;
  const title = locale === 'zh' ? frontmatter.title.zh : frontmatter.title.en;
  const description = locale === 'zh' ? frontmatter.description.zh : frontmatter.description.en;
  const highlights = locale === 'zh' ? frontmatter.highlights.zh : frontmatter.highlights.en;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            href={`/${locale}/works`}
            className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-8"
          >
            <FiArrowLeft /> {locale === 'zh' ? '返回作品列表' : 'Back to works'}
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="aspect-video rounded-2xl bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 mb-8 overflow-hidden">
            {frontmatter.thumbnail ? (
              <img src={frontmatter.thumbnail} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl font-black text-indigo-300/30 dark:text-indigo-500/10">{title.charAt(0)}</span>
              </div>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white mb-4">{title}</h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-6">{description}</p>

          {/* Tags + Links */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {frontmatter.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {frontmatter.demo_url && (
              <a href={frontmatter.demo_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity">
                <FiExternalLink size={16} /> {t('liveDemo')}
              </a>
            )}
            {frontmatter.github_url && (
              <a href={frontmatter.github_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <FiGithub size={16} /> {t('sourceCode')}
              </a>
            )}
          </div>
        </motion.div>

        {/* Highlights */}
        {highlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10"
          >
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-lg">✨</span>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{h}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose-content bg-white dark:bg-zinc-950 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800"
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </motion.div>

        {/* Gallery */}
        {frontmatter.gallery && frontmatter.gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <FiImage className="text-indigo-500" />
              {locale === 'zh' ? '应用截图' : 'App Screenshots'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {frontmatter.gallery.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="group relative aspect-[9/19] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900"
                >
                  <img
                    src={img.src}
                    alt={locale === 'zh' ? img.caption.zh : img.caption.en}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 pt-8">
                    <p className="text-white text-xs font-medium">
                      {locale === 'zh' ? img.caption.zh : img.caption.en}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Works */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-20"
          >
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">
              {t('relatedProjects')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((w, i) => (
                <WorkCard key={w.slug} work={w} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
