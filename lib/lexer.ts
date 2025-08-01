// lexer.ts — A lightweight, fast, and flexible lexical analyzer for tokenizing source code with zero dependencies.
//
// repo   : https://github.com/je-es/lexer
// author : https://github.com/maysara-elshewehy
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import { Lexer, error as customError, compile as customCompile } from './core';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    // Token interface
    export interface Token {
        type        : string;
        value       : string | null;
        pos         : { line: number; col: number; };
    }

    // Lexer rules type
    export type Rules = Lexer;

    // Error token symbol
    export const error = customError;

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ CORE ════════════════════════════════════════╗

    /**
     * Creates lexer rules for tokenizing source code.
     *
     * @param rules - An object containing lexer rules for different token types.
     *
     * @returns A lexer that can tokenize source code.
     */
    export const createRules = customCompile;

    /**
     * Tokenizes the given source code using the provided lexer rules.
     * Optimized version that pre-allocates token array and avoids unnecessary checks.
     *
     * @param rules         - The lexer rules to apply for tokenizing the source code.
     * @param source_code   - The source code to be tokenized.
     *
     * @returns An array of tokens, each with its type, value, and position.
     */
    export function tokenize(rules: Rules, source_code: string): Token[] {
        const sourceLength = source_code.length;

        // Early return for empty input
        if (sourceLength === 0) {
            return [];
        }

        // Use regular array and let JavaScript handle resizing
        const tokens: Token[] = [];

        rules.reset(source_code);

        // Optimized token iteration - avoid iterator overhead
        let token = rules.next();
        while (token !== undefined) {
            tokens.push({
                type    : token.type,
                value   : token.value.length ? token.value : null,
                pos     : { line: token.line, col: token.col }
            });

            // Stop on error to match original behavior
            if (token.type === "error") break;

            token = rules.next();
        }

        return tokens;
    }

    // Export default object
    export default { createRules, error, tokenize };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝