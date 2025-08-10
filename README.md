### i18n-direct React Monorepo

- packages/
  - i18n-direct-react: React library
  - i18n-direct-cli: CLI generator
- example/react-app: Example app using library and CLI

#### Install

```
npm install
npm run build
```

#### Example app

```
cd example/react-app
npm run dev
```

#### Configuration

In your app's package.json add:

```json
{
  "i18nDirect": {
    "languages": ["en", "fr", "de"],
    "defaultLanguage": "en",
    "outputDir": "src/translations"
  }
}
```

Set your Google key in `.env` as `GOOGLE_TRANSLATE_API_KEY`.

#### CLI

```
npm run generate-translations
```

Scans for `t("...")`, generates stable keys and language JSON files.