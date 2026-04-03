export interface LanguageKeys {}

type EnsureKeysGenerated = keyof LanguageKeys extends never
    ? "LanguageKeys is empty — run `pnpm flint-i18n generate` to generate types"
    : keyof LanguageKeys
