import { useTranslations } from 'next-intl';
import { getAllWorks, getAllTags } from '@/lib/works';
import WorkGrid from '@/components/works/WorkGrid';

export default function WorksPage() {
  const t = useTranslations('works');
  const works = getAllWorks();
  const allTags = getAllTags();

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            {t('subtitle')}
          </p>
        </div>
        <WorkGrid works={works} allTags={allTags} />
      </div>
    </div>
  );
}
