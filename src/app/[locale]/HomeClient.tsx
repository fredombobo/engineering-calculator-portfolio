'use client';

import Hero from '@/components/home/Hero';
import SkillCloud from '@/components/home/SkillCloud';
import FeaturedWorks from '@/components/home/FeaturedWorks';
import type { Work } from '@/lib/works';

export default function HomeClient({ works }: { works: Work[] }) {
  const scrollToAI = () => {
    const fab = document.querySelector('[aria-label="AI 作品助手"], [aria-label="AI Assistant"]');
    if (fab instanceof HTMLElement) fab.click();
  };

  return (
    <>
      <Hero onCtaClick={scrollToAI} />
      <SkillCloud />
      <FeaturedWorks works={works} />
    </>
  );
}
