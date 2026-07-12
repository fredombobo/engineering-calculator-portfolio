import { NextRequest, NextResponse } from 'next/server';
import { getAllWorks, getWorkBySlug } from '@/lib/works';
import { buildKnowledgeBase, generateSystemPrompt, searchKnowledgeBase } from '@/lib/ai';
import fs from 'fs';
import path from 'path';

const SITE_OWNER = '站长';

// Parse about content
function getAboutContent(): { zh: string; en: string } {
  try {
    const filePath = path.join(process.cwd(), 'src', 'content', 'about.md');
    if (!fs.existsSync(filePath)) return { zh: '', en: '' };
    const raw = fs.readFileSync(filePath, 'utf-8');
    const lines = raw.split('\n');
    let zh = '', en = '';
    let inZh = false, inEn = false;
    for (const line of lines) {
      if (line.includes('bio_zh:')) { inZh = true; inEn = false; zh += line.replace(/^.*bio_zh:\s*"?/, '').replace(/"$/, '') + '\n'; }
      else if (line.includes('bio_en:')) { inEn = true; inZh = false; en += line.replace(/^.*bio_en:\s*"?/, '').replace(/"$/, '') + '\n'; }
      else if (inZh && line.startsWith('  ') && !line.includes(':')) { zh += line.trim() + '\n'; }
      else if (inEn && line.startsWith('  ') && !line.includes(':')) { en += line.trim() + '\n'; }
      else if (line.trim() === '' || line.includes('skills:') || line.includes('experience:')) { inZh = false; inEn = false; }
    }
    return { zh: zh.trim(), en: en.trim() };
  } catch {
    return { zh: '', en: '' };
  }
}

// Parse FAQ content
function getFAQContent(): Array<{ question_zh: string; question_en: string; answer_zh: string; answer_en: string }> {
  try {
    const filePath = path.join(process.cwd(), 'src', 'content', 'faq.md');
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf-8');
    // Simple extraction of FAQ items
    const items: Array<{ question_zh: string; question_en: string; answer_zh: string; answer_en: string }> = [];
    const blocks = raw.split(/- question_zh:/).slice(1);
    for (const block of blocks) {
      const qzhMatch = block.match(/"([^"]*)"/);
      const qenMatch = block.match(/question_en:\s*"([^"]*)"/);
      const azhMatch = block.match(/answer_zh:\s*"([^"]*)"/);
      const aenMatch = block.match(/answer_en:\s*"([^"]*)"/);
      if (qzhMatch && azhMatch) {
        items.push({
          question_zh: qzhMatch[1],
          question_en: qenMatch?.[1] || '',
          answer_zh: azhMatch[1],
          answer_en: aenMatch?.[1] || '',
        });
      }
    }
    return items;
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const { question, language } = await request.json();
    const lang = language === 'en' ? 'en' : 'zh';

    if (!question?.trim()) {
      return NextResponse.json({ answer: 'Please ask a question.', sources: [] });
    }

    // Build knowledge base
    const works = getAllWorks();
    const aboutContent = getAboutContent();
    const knowledgeChunks = buildKnowledgeBase(
      works.map(w => ({
        slug: w.slug,
        frontmatter: w.frontmatter,
        content: w.content,
      })),
      aboutContent
    );

    // Add FAQ chunks
    const faqItems = getFAQContent();
    for (const faq of faqItems) {
      knowledgeChunks.push({
        id: `faq-${faq.question_zh.substring(0, 20)}`,
        content: `Q: ${lang === 'zh' ? faq.question_zh : faq.question_en}\nA: ${lang === 'zh' ? faq.answer_zh : faq.answer_en}`,
        language: lang as 'zh' | 'en',
        metadata: { section: 'faq', priority: 10 },
      });
    }

    // Search relevant knowledge
    const relevantChunks = searchKnowledgeBase(question, knowledgeChunks, lang as 'zh' | 'en', 5);
    const contextText = relevantChunks.map(c => c.content).join('\n\n---\n\n');
    const sourceSlugs = [...new Set(relevantChunks.filter(c => c.projectSlug).map(c => c.projectSlug!))];
    const sources = sourceSlugs.map((s: string) => {
      const w = getWorkBySlug(s);
      return w ? (lang === 'zh' ? w.frontmatter.title.zh : w.frontmatter.title.en) : s;
    });

    // Generate system prompt
    const systemPrompt = generateSystemPrompt(SITE_OWNER, contextText || 'No specific projects available yet.', lang as 'zh' | 'en');

    // Call DeepSeek Chat API directly
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('DeepSeek API error:', response.status, errBody);
      throw new Error(`DeepSeek API returned ${response.status}`);
    }

    const result = await response.json();
    const text = result.choices?.[0]?.message?.content || '';


    return NextResponse.json({
      answer: text,
      sources: sources.length > 0 ? sources : undefined,
    });
  } catch (error: unknown) {
    console.error('AI Chat error:', error);
    const errMsg = error instanceof Error ? error.message : 'Unknown error';

    // If API key is not set, return a helpful message
    if (errMsg.includes('API key') || errMsg.includes('apiKey') || errMsg.includes('401')) {
      return NextResponse.json({
        answer: 'AI 助手尚未配置 API Key。请在环境变量中设置 DEEPSEEK_API_KEY。',
        error: 'missing_key',
      });
    }

    return NextResponse.json({
      answer: 'AI 助手暂时无法连接，请稍后再试或直接浏览作品页面。',
      error: 'api_error',
    });
  }
}
