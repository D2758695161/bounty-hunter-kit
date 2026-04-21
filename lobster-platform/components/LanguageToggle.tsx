'use client';

import { useLanguage } from '../lib/LanguageContext';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
      className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-full text-sm font-bold bg-lobster-accent/20 border border-lobster-accent/40 text-lobster-accent hover:bg-lobster-accent/30 transition-all"
      style={{ backdropFilter: 'blur(8px)' }}
      aria-label="Toggle language"
    >
      {lang === 'zh' ? '🇨🇳 中文' : '🇺🇸 EN'}
    </button>
  );
}
