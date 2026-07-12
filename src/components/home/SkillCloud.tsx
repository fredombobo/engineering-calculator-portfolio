'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const skills = [
  'ArkTS', 'ArkUI', 'HarmonyOS', 'API 23', 'Stage Model',
  'DevEco Studio', 'Hvigor', 'Hypium', '工程计算', '流体输送',
  '泵与风机', '传热', '蒸汽系统', '化工计算', 'UX',
];

export default function SkillCloud() {
  const t = useTranslations('home');
  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-12"
        >
          {t('skills')}
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {skills.map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.15, y: -3 }}
              className={`px-4 py-2 rounded-full text-sm font-medium cursor-default ${
                i % 3 === 0
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                  : i % 3 === 1
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                  : 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300'
              }`}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
