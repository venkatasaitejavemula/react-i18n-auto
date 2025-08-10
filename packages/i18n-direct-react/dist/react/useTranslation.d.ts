export declare function useTranslation(): {
    readonly t: (text: string, options?: {
        defaultValue?: string;
    }) => string;
    readonly i18n: {
        readonly language: string;
    };
};
