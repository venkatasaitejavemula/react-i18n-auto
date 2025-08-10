interface TranslationMap {
    [lang: string]: string;
}
export declare function translateTextBatch(sourceText: string, targetLanguages: string[]): Promise<TranslationMap>;
export {};
