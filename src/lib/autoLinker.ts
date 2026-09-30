import { KNOWN_TICKERS } from "@/data/stocksData";
import { GLOSSARY_ITEMS } from "@/data/glossaryData";

/**
 * Enriches raw article HTML by:
 * 1. Identifying recognized stock tickers (e.g. HPG, VCB, FPT...) and auto-linking them to /ma/[ticker]
 * 2. Identifying core financial terms (e.g. NIM, CASA, NPL, P/B, P/E, ROE...) and adding glossary hints linking to /thuat-ngu
 *
 * It carefully processes only text outside of HTML tags and does NOT nested-link inside existing <a> tags.
 */
export function enrichArticleContent(html: string): string {
  if (!html) return "";

  // Split content by HTML tags: every even index is text content, odd index is HTML tag
  const tokens = html.split(/(<[^>]+>)/g);
  let inAnchor = false;
  let inHeadingOrCode = false;

  // Build regex for tickers
  const tickerPattern = KNOWN_TICKERS.join("|");
  const tickerRegex = new RegExp(`\\b(${tickerPattern})\\b`, "g");

  // Build regex for glossary terms
  const glossaryTerms = GLOSSARY_ITEMS.map((g) => g.term.replace("/", "\\/"));
  const glossaryRegex = new RegExp(`\\b(${glossaryTerms.join("|")})\\b`, "g");

  const processedTokens = tokens.map((token) => {
    // Check if current token is an HTML tag
    if (token.startsWith("<")) {
      if (/^<a\b/i.test(token)) inAnchor = true;
      if (/^<\/a>/i.test(token)) inAnchor = false;
      if (/^<h[1-6]\b|^<code\b|^<pre\b/i.test(token)) inHeadingOrCode = true;
      if (/^<\/h[1-6]>|^<\/code>|^<\/pre>/i.test(token)) inHeadingOrCode = false;
      return token;
    }

    // Do not linkify inside existing links, headings, or code snippets
    if (inAnchor || inHeadingOrCode || token.trim() === "") {
      return token;
    }

    let text = token;

    // 1. Auto-link Stock Tickers
    text = text.replace(tickerRegex, (match) => {
      return `<a href="/ma/${match}" class="inline-flex items-center gap-0.5 px-1.5 py-0.5 mx-0.5 font-mono font-bold text-[#1E40AF] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] rounded text-[0.85em] leading-tight no-underline hover:no-underline transition-colors align-baseline" title="Xem hồ sơ chỉ số & bài viết về ${match}">${match}<span class="text-[9px] opacity-75 font-sans">↗</span></a>`;
    });

    // 2. Auto-link Glossary Terms
    text = text.replace(glossaryRegex, (match) => {
      const slug = match.toLowerCase().replace("/", "");
      return `<a href="/thuat-ngu#${slug}" class="underline decoration-dotted decoration-[#1E40AF] decoration-2 underline-offset-4 text-[#111827] hover:text-[#1E40AF] font-semibold cursor-help" title="Nhấn để xem giải nghĩa thuật ngữ ${match}">${match}</a>`;
    });

    return text;
  });

  return processedTokens.join("");
}
