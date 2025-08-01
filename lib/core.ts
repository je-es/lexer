// core.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ TYPES ═══════════════════════════════════════╗

    export interface Token {
        type: string;
        value: string;
        offset: number;
        line: number;
        col: number;
    }

    export interface RuleConfig {
        match: RegExp;
        value?: (text: string) => string;
        lineBreaks?: boolean;
    }

    export type Rule = string | RegExp | string[] | RuleConfig;

    export interface Rules {
        [key: string]: Rule;
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ CORE ════════════════════════════════════════╗

    export class Lexer {
        private fastRegex       : RegExp | null                         = null;
        private ruleTypes       : string[]                              = [];
        private ruleTransforms  : (((text: string) => string) | null)[] = [];
        private ruleLineBreaks  : boolean[]                             = [];
        private buffer          : string                                = '';
        private position        : number                                = 0;
        private line            : number                                = 1;
        private col             : number                                = 1;
        private length          : number                                = 0;

        constructor(rules: Rules) {
            this.compileRules(rules);
        }

        private compileRules(rules: Rules): void {
            const patterns      : string[]                              = [];
            const types         : string[]                              = [];
            const transforms    : (((text: string) => string) | null)[] = [];
            const lineBreaks    : boolean[]                             = [];

            for (const [name, rule] of Object.entries(rules)) {
                let pattern         : string;
                let transform       : ((text: string) => string) | null = null;
                let hasLineBreaks   : boolean                           = false;

                if (typeof rule === 'symbol' && rule === error) {
                    // Skip error rule for now - handle in fallback
                    continue;
                } else if (typeof rule === 'string') {
                    pattern = this.escapeRegex(rule);
                } else if (rule instanceof RegExp) {
                    pattern = rule.source;
                } else if (Array.isArray(rule)) {
                    // Keywords with word boundaries - optimize common case
                    if (rule.length === 1) {
                        pattern = `${this.escapeRegex(rule[0])}(?![a-zA-Z0-9_])`;
                    } else {
                        pattern = `(?:${rule.map(k => this.escapeRegex(k)).join('|')})(?![a-zA-Z0-9_])`;
                    }
                } else {
                    // RuleConfig
                    const config = rule as RuleConfig;
                    pattern = config.match.source;
                    transform = config.value || null;
                    hasLineBreaks = config.lineBreaks || false;
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

        reset(input: string): void {
            this.buffer = input;
            this.length = input.length;
            this.position = 0;
            this.line = 1;
            this.col = 1;

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
                    let text = '';

                    // Start from index 1 (skip full match)
                    for (let i = 1; i < match.length; i++) {
                        if (match[i] !== undefined) {
                            ruleIndex = i - 1;
                            text = match[i];
                            break;
                        }
                    }

                    const startLine = this.line;
                    const startCol = this.col;
                    const startPos = this.position;
                    const textLength = text.length;

                    // Update position
                    this.position += textLength;

                    // Optimized line/col tracking
                    if (this.ruleLineBreaks[ruleIndex]) {
                        // Fast newline counting
                        for (let i = 0; i < textLength; i++) {
                            if (text.charCodeAt(i) === 10) { // '\n'
                                this.line++;
                                this.col = 1;
                            } else {
                                this.col++;
                            }
                        }
                    } else {
                        this.col += textLength;
                    }

                    // Apply transformation if exists
                    const transform = this.ruleTransforms[ruleIndex];
                    const value = transform ? transform(text) : text;

                    return {
                        type        : this.ruleTypes[ruleIndex],
                        value,
                        offset      : startPos,
                        line        : startLine,
                        col         : startCol
                    };
                }
            }

            // Fallback: error token
            const char = this.buffer[this.position];
            const token = {
                type        : 'error',
                value       : char,
                offset      : this.position,
                line        : this.line,
                col         : this.col
            };

            this.position++;
            this.col++;

            return token;
        }

        *[Symbol.iterator](): Iterator<Token> {
            let token: Token | undefined;
            while ((token = this.next()) !== undefined) {
                yield token;
            }
        }
    }

    export const error = Symbol('error');

    export function compile(rules: Rules): Lexer {
        return new Lexer(rules);
    }

    export default { compile, error };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝