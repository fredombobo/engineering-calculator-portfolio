'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import type { Work } from '@/lib/works';
import WorkCard from './WorkCard';

export default function WorkGrid({ works, allTags }: { works: Work[]; allTags: string[] }) {
  const t = useTranslations('works');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleTag = (tag: string) => {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filtered = works.filter(work => {
    if (activeTags.length > 0 && !activeTags.every(t => work.frontmatter.tags.includes(t))) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const zhTitle = work.frontmatter.title.zh.toLowerCase();
      const enTitle = work.frontmatter.title.en.toLowerCase();
      const zhDesc = work.frontmatter.description.zh.toLowerCase();
      const enDesc = work.frontmatter.description.en.toLowerCase();
      if (!zhTitle.includes(q) && !enTitle.includes(q) && !zhDesc.includes(q) && !enDesc.includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full max-w-md px-5 py-3 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
        />
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTags([])}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
            activeTags.length === 0
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          {t('all')}
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
              activeTags.includes(tag)
                ? 'bg-indigo-500 text-white'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Works Grid */}
      <AnimatePresence mode="wait">
        {filtered.length > 0 ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((work, i) => (
              <WorkCard key={work.slug} work={work} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-zinc-400 dark:text-zinc-500 text-lg">{t('noProjects')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
