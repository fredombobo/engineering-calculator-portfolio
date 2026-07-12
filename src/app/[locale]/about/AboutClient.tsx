'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';

export default function AboutClient({ data }: { data: any }) {
  const t = useTranslations('about');
  const locale = useLocale();
  if (!data) return null;

  const bio = locale === 'zh' ? data.bio_zh : data.bio_en;
  const skills = data.skills || [];
  const experience = data.experience || [];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white mb-16 text-center"
        >
          {t('title')}
        </motion.h1>

        {/* Bio */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">{t('bio')}</h2>
          <div className="prose-content bg-white dark:bg-zinc-950 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800">
            {(bio || '').split('\n').filter(Boolean).map((p: string, i: number) => (
              <p key={i} className="mb-3 last:mb-0 text-zinc-700 dark:text-zinc-300 leading-relaxed">{p}</p>
            ))}
          </div>
        </motion.section>

        {/* Skills */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">{t('skills')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {skills.map((cat: { category: string; items: { zh: string[]; en: string[] } }, i: number) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">{cat.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {(locale === 'zh' ? cat.items.zh : cat.items.en).map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Experience */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">{t('experience')}</h2>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800" />
            {experience.map((exp: {
              period: string;
              title_zh: string;
              title_en: string;
              company_zh: string;
              company_en: string;
              description_zh: string;
              description_en: string;
            }, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="relative pl-14 pb-10 last:pb-0"
              >
                <div className="absolute left-3.5 top-1.5 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-zinc-950" />
                <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                  {exp.period}
                </span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-2">
                  {locale === 'zh' ? exp.title_zh : exp.title_en}
                </h3>
                <p className="text-sm text-indigo-500 dark:text-indigo-400 mb-1">
                  {locale === 'zh' ? exp.company_zh : exp.company_en}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {locale === 'zh' ? exp.description_zh : exp.description_en}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">{t('contact')}</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="mailto:hello@example.com"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium">
              ✉️ hello@example.com
            </a>
            <a href="https://github.com/fredombobo" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium">
              🐙 GitHub
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
