'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiX, FiMessageCircle, FiTrash2 } from 'react-icons/fi';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: string[];
}

export default function AIChat() {
  const t = useTranslations('ai');
  const locale = useLocale();
  const lang = locale === 'zh' ? 'zh' : 'en';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', content: t('welcome') },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMsg.content,
          language: lang,
          history: messages.filter(m => m.role !== 'system').slice(-6).map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(res.status === 429 ? 'rate_limit' : 'api_error');
      }

      const data = await res.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.name : 'unknown';
      if (errMsg === 'AbortError') {
        setError('timeout');
      } else if (errMsg === 'rate_limit') {
        setError('fallback');
      } else {
        setError('fallback');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = (question: string) => {
    setInput(question);
    handleSubmit();
  };

  const handleClear = () => {
    setMessages([{ id: 'welcome', role: 'assistant', content: t('welcome') }]);
    setError(null);
  };

  const presets = [t('preset1'), t('preset2'), t('preset3')];

  const getErrorText = () => {
    if (error === 'timeout') return t('timeout');
    if (error === 'fallback') return t('fallback');
    if (error === 'networkError') return t('networkError');
    return t('fallback');
  };

  return (
    <>
      {/* FAB Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all cursor-pointer ${
          isOpen
            ? 'bg-zinc-700 dark:bg-zinc-600 rotate-90'
            : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:shadow-xl'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={t('title')}
      >
        {isOpen ? <FiX size={22} /> : <FiMessageCircle size={22} />}
        {!isOpen && (
          <motion.span
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-zinc-950"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-md h-[600px] max-h-[calc(100vh-8rem)] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm">
                  🤖
                </div>
                <span className="font-semibold text-sm text-zinc-900 dark:text-white">
                  {t('title')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClear}
                  className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  aria-label={t('clear')}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-br-md'
                        : msg.role === 'assistant'
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-md'
                        : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs italic'
                    }`}
                  >
                    {msg.content}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                        <p className="text-xs text-zinc-400 mb-1">📎 来源：</p>
                        {msg.sources.map((src, i) => (
                          <span key={i} className="inline-block px-2 py-0.5 rounded-full text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 mr-1 mb-1">
                            {src}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-500"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center">
                  <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                    {getErrorText()}
                  </p>
                </div>
              )}

              {/* Preset questions when empty */}
              {messages.length <= 1 && !isLoading && !error && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-zinc-400 text-center">💡 {lang === 'zh' ? '试试这些问题' : 'Try these questions'}</p>
                  {presets.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handlePresetClick(q)}
                      className="w-full text-left px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors border border-zinc-200 dark:border-zinc-700/50 cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={t('placeholder')}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center disabled:opacity-30 transition-opacity cursor-pointer"
              >
                <FiSend size={16} />
              </button>
            </form>

            {/* Disclaimer */}
            <p className="px-4 pb-2 text-[10px] text-zinc-400 dark:text-zinc-600 text-center">
              {t('disclaimer')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
