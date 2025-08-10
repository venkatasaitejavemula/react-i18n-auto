#!/usr/bin/env node
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import { parse } from 'acorn';
import * as walk from 'acorn-walk';
import crypto from 'crypto';
const cwd = process.cwd();
const getFetch = async () => {
    if (typeof globalThis.fetch === 'function')
        return globalThis.fetch;
    const mod = await import('node-fetch');
    return (mod.default || mod);
};
function loadConfig() {
    const pkgPath = path.join(cwd, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const cfg = pkg.i18nDirect || {};
    const languages = cfg.languages || ['en'];
    const defaultLanguage = cfg.defaultLanguage || 'en';
    const outputDir = cfg.outputDir || 'src/translations';
    return { languages, defaultLanguage, outputDir };
}
function stableKeyFor(input) {
    const hash = crypto.createHash('sha1').update(input).digest('hex').slice(0, 10);
    return `msg_${hash}`;
}
async function scanSourceFiles() {
    const patterns = ['src/**/*.{ts,tsx,js,jsx}'];
    const files = await fg(patterns, { cwd, absolute: true, ignore: ['**/node_modules/**', '**/dist/**'] });
    const messages = new Set();
    for (const file of files) {
        const code = fs.readFileSync(file, 'utf8');
        let ast;
        try {
            ast = parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
        }
        catch {
            continue;
        }
        walk.simple(ast, {
            CallExpression(node) {
                var _a;
                if (node.callee && node.callee.name === 't' && ((_a = node.arguments) === null || _a === void 0 ? void 0 : _a.length)) {
                    const arg = node.arguments[0];
                    if (arg.type === 'Literal' && typeof arg.value === 'string') {
                        messages.add(arg.value);
                    }
                }
            }
        });
    }
    return Array.from(messages);
}
async function ensureDir(p) {
    await fs.promises.mkdir(p, { recursive: true });
}
async function translate(text, target, apiKey) {
    var _a, _b, _c, _d;
    const key = process.env.GOOGLE_TRANSLATE_API_KEY || process.env.GOOGLE_API_KEY || apiKey;
    if (!key)
        return null;
    try {
        const f = await getFetch();
        const res = await f(`https://translation.googleapis.com/language/translate/v2?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: text, target })
        });
        if (!('ok' in res) || !res.ok)
            return null;
        const json = await res.json();
        return (_d = (_c = (_b = (_a = json === null || json === void 0 ? void 0 : json.data) === null || _a === void 0 ? void 0 : _a.translations) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.translatedText) !== null && _d !== void 0 ? _d : null;
    }
    catch {
        return null;
    }
}
async function run() {
    const { languages, defaultLanguage, outputDir } = loadConfig();
    const messages = await scanSourceFiles();
    if (messages.length === 0) {
        console.log('No messages found.');
        return;
    }
    const outAbs = path.join(cwd, outputDir);
    await ensureDir(outAbs);
    // Load existing per-language files for caching
    const existingByLang = {};
    for (const lang of languages) {
        const file = path.join(outAbs, `${lang}.json`);
        existingByLang[lang] = fs.existsSync(file)
            ? JSON.parse(fs.readFileSync(file, 'utf8'))
            : {};
    }
    const byLang = {};
    for (const lang of languages)
        byLang[lang] = { ...existingByLang[lang] };
    for (const message of messages) {
        const fullKey = stableKeyFor(message);
        if (!byLang[defaultLanguage][fullKey]) {
            byLang[defaultLanguage][fullKey] = message;
        }
    }
    const targets = languages.filter((l) => l !== defaultLanguage);
    for (const target of targets) {
        for (const message of messages) {
            const fullKey = stableKeyFor(message);
            if (byLang[target][fullKey])
                continue; // cached
            const translated = await translate(message, target);
            byLang[target][fullKey] = translated !== null && translated !== void 0 ? translated : message;
        }
    }
    for (const lang of languages) {
        const file = path.join(outAbs, `${lang}.json`);
        const merged = { ...byLang[lang] };
        fs.writeFileSync(file, JSON.stringify(merged, null, 2));
        console.log(`Wrote ${file}`);
    }
}
run().catch((e) => {
    console.error(e);
    process.exit(1);
});
