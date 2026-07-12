'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
}

export default function Hero({ onCtaClick }: { onCtaClick?: () => void }) {
  const t = useTranslations('home');
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const initial: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
      hue: Math.random() * 60 + 250,
    }));
    setParticles(initial);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: ((p.x + p.speedX) % 100 + 100) % 100,
        y: ((p.y + p.speedY) % 100 + 100) % 100,
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-white dark:bg-zinc-950"
    >
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: `${p.size}px`, height: `${p.size}px`,
              opacity: p.opacity,
              backgroundColor: `hsl(${p.hue}, 80%, 65%)`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      {/* Gradient orbs */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl transition-transform duration-1000 ease-out pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)',
          left: `${mousePos.x * 100 - 20}%`, top: `${mousePos.y * 100 - 20}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        className="absolute w-64 h-64 rounded-full blur-3xl transition-transform duration-1500 ease-out pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.1), transparent 70%)',
          left: `${(1 - mousePos.x) * 100 - 15}%`, top: `${(1 - mousePos.y) * 100 - 15}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-4 text-center py-20"
      >
        <motion.p variants={childVariants} className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 mb-4 font-mono">
          {t('greeting')}
        </motion.p>

        <motion.h1 variants={childVariants} className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-6">
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {t('name')}
          </span>
        </motion.h1>

        <motion.p variants={childVariants} className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          {t('tagline')}
        </motion.p>

        <motion.div variants={childVariants}>
          <motion.button
            onClick={onCtaClick}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-lg overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">{t('cta')}</span>
            <motion.span
              className="relative z-10 text-xl"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              →
            </motion.span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 1 }}
            />
          </motion.button>
        </motion.div>

        <motion.div
          variants={childVariants}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-zinc-300 dark:border-zinc-600 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-zinc-400 dark:bg-zinc-500" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
