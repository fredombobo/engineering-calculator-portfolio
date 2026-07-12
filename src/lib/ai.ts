export interface KnowledgeChunk {
  id: string;
  content: string;
  projectSlug?: string;
  language: 'zh' | 'en';
  metadata: {
    section: string;
    priority: number;
  };
}

export function buildKnowledgeBase(works: Array<{
  slug: string;
  frontmatter: { title: { zh: string; en: string }; description: { zh: string; en: string }; tags: string[]; highlights: { zh: string[]; en: string[] } };
  content: string;
}>, aboutContent?: { zh: string; en: string }): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  
  for (const work of works) {
    chunks.push({
      id: `${work.slug}-zh-basic`,
      content: `项目名称：${work.frontmatter.title.zh}\n描述：${work.frontmatter.description.zh}\n技术栈：${work.frontmatter.tags.join(', ')}\n亮点：${(work.frontmatter.highlights.zh || []).join('、')}`,
      projectSlug: work.slug,
      language: 'zh',
      metadata: { section: 'basic', priority: 10 },
    });
    
    chunks.push({
      id: `${work.slug}-en-basic`,
      content: `Project: ${work.frontmatter.title.en}\nDescription: ${work.frontmatter.description.en}\nTech Stack: ${work.frontmatter.tags.join(', ')}\nHighlights: ${(work.frontmatter.highlights.en || []).join(', ')}`,
      projectSlug: work.slug,
      language: 'en',
      metadata: { section: 'basic', priority: 10 },
    });
    
    chunks.push({
      id: `${work.slug}-detail`,
      content: work.content,
      projectSlug: work.slug,
      language: 'zh',
      metadata: { section: 'detail', priority: 5 },
    });
  }
  
  if (aboutContent) {
    chunks.push({
      id: 'about-zh',
      content: aboutContent.zh,
      language: 'zh',
      metadata: { section: 'about', priority: 8 },
    });
    chunks.push({
      id: 'about-en',
      content: aboutContent.en,
      language: 'en',
      metadata: { section: 'about', priority: 8 },
    });
  }
  
  return chunks;
}

export function generateSystemPrompt(
  siteOwnerName: string,
  knowledgeContext: string,
  language: 'zh' | 'en'
): string {
  const prompts = {
    zh: `你是${siteOwnerName}个人作品网站的AI助手。
你的唯一职责：回答关于${siteOwnerName}的作品、项目、技能和职业经验的问题。

规则：
1. 只使用下面提供的知识库内容回答。如果答案不在知识库中，说"抱歉，我目前没有关于这个问题的信息。你可以试着浏览我的作品页面了解更多。"
2. 始终用中文回答。
3. 提到项目时，务必包含项目名称。
4. 回答要简洁具体，给出实例而非泛泛而谈。
5. 绝不编造信息。如果不确定，坦诚承认。
6. 对于无关问题（天气、政治、闲聊等），礼貌拒绝："抱歉，我只能回答关于${siteOwnerName}的作品和项目相关的问题。你可以试试问我关于他的技术栈、项目经验等方面的问题。"

知识库内容：
${knowledgeContext}`,
    en: `You are an AI assistant for ${siteOwnerName}'s portfolio website.
Your ONLY role: answer questions about ${siteOwnerName}'s works, projects, skills, and professional experience.

Rules:
1. ONLY use the provided knowledge base below to answer. If the answer is not in the context, say "Sorry, I don't have information on this yet. Try browsing the works page for more details."
2. Always answer in English.
3. When referencing a project, ALWAYS include the project name.
4. Be concise and specific. Give concrete examples rather than vague statements.
5. NEVER fabricate information. If unsure, admit it.
6. For unrelated questions, politely decline: "Sorry, I can only answer questions about ${siteOwnerName}'s works and projects. Try asking about his tech stack or project experience."

Knowledge base:
${knowledgeContext}`,
  };
  
  return prompts[language] || prompts.zh;
}

export function searchKnowledgeBase(
  query: string,
  chunks: KnowledgeChunk[],
  language: 'zh' | 'en',
  topK: number = 3
): KnowledgeChunk[] {
  const langChunks = chunks.filter(c => c.language === language || !c.language);
  
  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  const scored = langChunks.map(chunk => {
    const content = chunk.content.toLowerCase();
    let score = 0;
    for (const term of queryTerms) {
      if (content.includes(term)) score += 1;
      if (content.includes(query.toLowerCase())) score += 3;
    }
    score += chunk.metadata.priority / 100;
    return { chunk, score };
  });
  
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(s => s.score > 0)
    .map(s => s.chunk);
}
