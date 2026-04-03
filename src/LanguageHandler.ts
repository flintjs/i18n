import { BaseHandler, BaseHandlerOptions, type FlintClient } from "@flint.js/core"
import { Language } from "./Language"

export interface LanguageHandlerOptions extends BaseHandlerOptions {
    defaultLanguage?: string
}

type TKey<TKeys, K extends string> = K extends keyof TKeys ? K : never

type TArgs<TKeys, K extends string> = K extends keyof TKeys
    ? [TKeys[K]] extends [never]
        ? [languageName?: string]
        : [params: TKeys[K], languageName?: string]
    : []

export class LanguageHandler<TKeys = Record<string, never>> extends BaseHandler<Language> {

    #defaultLanguage: string

    constructor(client: FlintClient, options: LanguageHandlerOptions) {
        super(client, options)
        this.#defaultLanguage = options.defaultLanguage ?? "en-US"
    }

    get(name: string): Language | undefined {
        return this.store.get(name)
    }

    get defaultLanguage(): string {
        return this.#defaultLanguage
    }

    t<K extends string>(key: TKey<TKeys, K>, ...args: TArgs<TKeys, K>): string {
        const params = (args[0] ?? {}) as Record<string, unknown>
        const languageName = args[1] as string | undefined
        const name = languageName ?? this.#defaultLanguage
        const language = this.store.get(name)

        if (!language) {
            const defaultLang = this.store.get(this.#defaultLanguage)
            if (!defaultLang) return key as string
            return defaultLang.get(key as string, params)
        }

        const result = language.get(key as string, params)

        if (result === (key as string) && name !== this.#defaultLanguage) {
            const defaultLang = this.store.get(this.#defaultLanguage)
            if (defaultLang) return defaultLang.get(key as string, params)
        }

        return result
    }

    translate<K extends string>(key: TKey<TKeys, K>, ...args: TArgs<TKeys, K>): string {
        return this.t(key, ...args)
    }

    translation<K extends string>(key: TKey<TKeys, K>, ...args: TArgs<TKeys, K>): string {
        return this.t(key, ...args)
    }

}
