const nodeEnv = (typeof globalThis !== 'undefined' && (globalThis as any).process?.env) || undefined;
const GOOGLE_API_KEY = nodeEnv?.GOOGLE_TRANSLATE_API_KEY || nodeEnv?.GOOGLE_API_KEY || undefined;

interface TranslationMap {
  [lang: string]: string;
}

export async function translateTextBatch(
  sourceText: string,
  targetLanguages: string[]
): Promise<TranslationMap> {
  if (!GOOGLE_API_KEY || typeof fetch !== 'function') return {};

  const results: TranslationMap = {};
  await Promise.all(
    targetLanguages.map(async (target) => {
      try {
        const translated = await translateText(sourceText, target);
        if (translated) results[target] = translated;
      } catch {}
    })
  );
  return results;
}

async function translateText(text: string, target: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, target })
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.translations?.[0]?.translatedText ?? null;
  } catch (e) {
    return null;
  }
}