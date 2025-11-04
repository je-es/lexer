// lexer.ts — Fast lexer for converting text and source code into a stream of tokens for parsing.
//
// repo   : https://github.com/je-es/lexer
// author : https://github.com/maysara-elshewehy
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ TYPE ════════════════════════════════════════╗

    // Represents a token with kind, value and position information
    export interface Token {
        kind                : string;
        value               : string | null;
        span                : Span;
    }

    // Represents a span in the source text
    export interface Span {
        start               : number;
        end                 : number;
    }

    // Configuration for a lexer rule defining how to match and process tokens
    export interface RuleConfig {
        match               : RegExp;
        value               ?: (text: string) => string;
        lineBreaks          ?: boolean;
    }

    // Defines a rule that can be a string, RegExp, string array, or RuleConfig
    export type Rule = string | RegExp | string[] | RuleConfig;

    // Collection of named rules for tokenization
    export interface Rules {
        [key: string]: Rule;
    }

    // Special symbol to denote error rules
    export const error = Symbol('error');

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ CORE ════════════════════════════════════════╗

    // Lexer class that tokenizes input based on provided rules.
    export class Lexer {
        private fastRegex       : RegExp | null                         = null;
        private ruleTypes       : string[]                              = [];
        private ruleTransforms  : (((text: string) => string) | null)[] = [];
        private ruleLineBreaks  : boolean[]                             = [];
        private buffer          : string                                = '';
        private position        : number                                = 0;
        private length          : number                                = 0;

        constructor(rules: Rules) {
            this.compileRules(rules);
        }

        private compileRules(rules: Rules): void {
            const patterns      : string[]                              = [];
            const types         : string[]                              = [];
            const transforms    : (((text: string) => string) | null)[] = [];
            const lineBreaks    : boolean[]                             = [];

            for (let [name, rule] of Object.entries(rules)) {
                let pattern         : string | undefined;
                let transform       : ((text: string) => string) | null = null;
                let hasLineBreaks   : boolean                           = false;

                if (typeof rule === 'symbol' && rule === error) {
                    // Skip error rule for now - handle in fallback
                    continue;
                } else if (typeof rule === 'string' || Array.isArray(rule)) {
                    if (typeof rule === 'string') {
                        // if is operator or punc (single or multi)
                        if (!/^[a-zA-Z0-9_]+$/.test(rule)) {
                            pattern = this.escapeRegex(rule);
                        }

                        // otherwise, it's a keyword
                        else {
                            rule = [rule];
                        }
                    }

                    if (Array.isArray(rule)) {
                        // This ensures keywords match only as complete words
                        if (rule.length === 1) {
                            pattern = `\\b${this.escapeRegex(rule[0])}\\b`;
                        } else if (rule.length > 1) {
                            pattern = `\\b(?:${rule.map(k => this.escapeRegex(k)).join('|')})\\b`;
                        }
                    }

                } else if (rule instanceof RegExp) {
                    pattern = rule.source;
                } else {
                    // RuleConfig
                    const config = rule as RuleConfig;
                    pattern = config.match.source;
                    transform = config.value || null;
                    hasLineBreaks = config.lineBreaks || false;
                }

                if (typeof pattern === 'undefined') {
                    throw new Error(`Pattern for rule "${name}" could not be determined.`);
                }

                patterns.push(`(${pattern})`);
                types.push(name);
                transforms.push(transform);
                lineBreaks.push(hasLineBreaks);
            }

            // Compile single mega-regex for maximum performance
            if (patterns.length > 0) {
                this.fastRegex = new RegExp(patterns.join('|'), 'gy');
            }

            // Store as flat arrays for better cache performance
            this.ruleTypes = types;
            this.ruleTransforms = transforms;
            this.ruleLineBreaks = lineBreaks;
        }

        private escapeRegex(str: string): string {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        setup(input: string): void {
            this.buffer = input;
            this.length = input.length;
            this.position = 0;

            if (this.fastRegex) {
                this.fastRegex.lastIndex = 0;
            }
        }

        next(): Token | undefined {
            // Early exit for end of input
            if (this.position >= this.length) {
                return undefined;
            }

            if (this.fastRegex) {
                this.fastRegex.lastIndex = this.position;
                const match = this.fastRegex.exec(this.buffer);

                if (match && match.index === this.position) {
                    // Find which group matched - optimized loop
                    let ruleIndex = 0;
                    let text : string | null = '';

                    // Start from index 1 (skip full match)
                    for (let i = 1; i < match.length; i++) {
                        if (match[i] !== undefined) {
                            ruleIndex = i - 1;
                            text = match[i];
                            break;
                        }
                    }

                    const startPos = this.position;
                    const textLength = text.length;

                    // Update position
                    this.position += textLength;

                    // Apply transformation if exists
                    const transform = this.ruleTransforms[ruleIndex];
                    const value : string | null = transform ? transform(text) : text;

                    return {
                        kind        : this.ruleTypes[ruleIndex],
                        value,
                        span        : { start: startPos, end: this.position },
                    };
                }
            }

            // Fallback: error token
            const char      = this.buffer[this.position];
            const token     = {
                kind        : 'error',
                value       : char,
                span        : { start: this.position, end: this.position },
            };

            this.position++;

            return token;
        }

        *[Symbol.iterator](): Iterator<Token> {
            let token: Token | undefined;
            while ((token = this.next()) !== undefined) {
                yield token;
            }
        }
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ MAIN ════════════════════════════════════════╗

    /**
    * Tokenizes source code using the provided rules
    *
    * @param source     - The source text to tokenize
    * @param rules      - Rules defining how to break the source into tokens
    * @param options    - Optional tokenization behavior settings
    *
    * @returns Array of tokens extracted from the source
    */
    export function tokenize(source: string, rules: Rules): Token[] {
        const sourceLength = source.length;

        // Early return for empty input
        if (sourceLength === 0) { return []; }

        // Use regular array and let JavaScript handle resizing
        const tokens: Token[] = [];

        // Initialize lexer with compiled rules
        const lexer = new Lexer(rules);

        // Setup lexer with input
        lexer.setup(source);

        // Optimized token iteration - avoid iterator overhead
        let token = lexer.next();
        while (token !== undefined) {
            tokens.push({
                kind    : token.kind,
                value   : token.value!.length ? token.value : null,
                span    : token.span
            });

            // Stop on error to match original behavior
            if (token.kind === "error") break;

            token = lexer.next();
        }

        return tokens;
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝