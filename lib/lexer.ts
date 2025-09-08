// lexer.ts — A tool for converting text into tokens..!
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
        priority            ?: number; // Higher numbers = higher priority
    }

    // Defines a rule that can be a string, RegExp, string array, or RuleConfig
    export type Rule = string | RegExp | string[] | RuleConfig;

    // Collection of named rules for tokenization
    export type Rules = Record<string, Rule>;

    // Options for tokenization behavior
    export interface TokenizeOptions {
        continueOnError    ?: boolean; // Default: false (stop at first error)
    }

    // Internal representation of a compiled rule
    export interface CompiledRule {
        pattern             : string;
        name                : string;
        transform           : ((text: string) => string) | null;
        lineBreaks          : boolean;
        priority            : number;
        originalLength      : number;
    }

    // Special symbol to denote error rules
    export const error = Symbol('error');

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ CORE ════════════════════════════════════════╗

    // Lexer class that tokenizes input based on provided rules.
    export class Lexer {

        // ┌──────────────────────────────── INIT ──────────────────────────────┐

            private fastRegex       : RegExp | null                         = null;
            private ruleTypes       : string[]                              = [];
            private ruleTransforms  : (((text: string) => string) | null)[] = [];
            private ruleLineBreaks  : boolean[]                             = []; // [TODO] review it.
            private buffer          : string                                = '';
            private position        : number                                = 0;
            private length          : number                                = 0;

            constructor(rules: Rules) {
                this.compileRules(rules);
            }

        // └────────────────────────────────────────────────────────────────────┘


        // ┌──────────────────────────────── MAIN ──────────────────────────────┐

            setup(input: string): void {
                this.buffer     = input;
                this.length     = input.length;
                this.position   = 0;

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
                    this.fastRegex.lastIndex    = this.position;
                    const match                 = this.fastRegex.exec(this.buffer);

                    if (match && match.index === this.position) {
                        // Find which group matched - optimized loop
                        let ruleIndex   = -1;
                        let text        = '';

                        // Start from index 1 (skip full match)
                        for (let i = 1; i < match.length; i++) {
                            if (match[i] !== undefined) {
                                ruleIndex   = i - 1;
                                text        = match[i];
                                break;
                            }
                        }

                        if (ruleIndex >= 0) {
                            const startPos  = this.position;
                            this.position  += text.length;

                            // Apply transformation if exists
                            const transform = this.ruleTransforms[ruleIndex];
                            const value     = transform ? transform(text) : text;

                            return {
                                kind    : this.ruleTypes[ruleIndex],
                                value   : value || null,
                                span    : { start: startPos, end: this.position }
                            };
                        }
                    }
                }

                // Enhanced error recovery: consume problematic character and continue
                const char      = this.buffer[this.position];
                const startPos  = this.position;
                this.position++;

                return {
                    kind    : 'error',
                    value   : char,
                    span    : { start: startPos, end: this.position }
                };
            }

        // └────────────────────────────────────────────────────────────────────┘


        // ┌──────────────────────────────── HELP ──────────────────────────────┐

            private compileRules(rules: Rules): void {
                const compiledRules: CompiledRule[] = [];

                // String to Array
                for (const [name, rule] of Object.entries(rules)) {
                    if (typeof rule === 'string') {
                        rules[name] = [rule];
                    }
                }

                // First pass: compile all rules with proper prioritization
                for (const [name, rule] of Object.entries(rules)) {
                    if (typeof rule === 'symbol' && rule === error) { continue; }

                    const compiled = this.compileRule(name, rule);
                    compiledRules.push(...compiled);
                }

                // Sort rules by priority to ensure correct matching
                compiledRules.sort((a, b) => {
                    // Higher priority first
                    if (a.priority !== b.priority) {
                        return b.priority - a.priority;
                    }

                    // Longer patterns first (for same priority)
                    if (a.originalLength !== b.originalLength) {
                        return b.originalLength - a.originalLength;
                    }

                    // Alphabetical for consistency
                    return a.name.localeCompare(b.name);
                });

                // Build optimized arrays
                const patterns      : string[]                                  = [];
                const types         : string[]                                  = [];
                const transforms    : (((text: string) => string) | null)[]     = [];
                const lineBreaks    : boolean[]                                 = [];

                for (const rule of compiledRules) {
                    patterns.push(`(${rule.pattern})`);
                    types.push(rule.name);
                    transforms.push(rule.transform);
                    lineBreaks.push(rule.lineBreaks);
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

            private compileRule(name: string, rule: Rule): CompiledRule[] {
                if (typeof rule === 'string') {
                    throw new Error('String rules should be converted to string arrays before compilation.');
                }

                if (rule instanceof RegExp) {
                    return [{
                        pattern: rule.source,
                        name,
                        transform       : null,
                        lineBreaks      : false,
                        priority        : this.calculateBasePriority('regex') + rule.source.length * 5,
                        originalLength  : rule.source.length
                    }];
                }

                if (Array.isArray(rule)) {
                    return this.compileStringArray(name, rule);
                }

                // RuleConfig
                const config = rule as RuleConfig;
                return [{
                    pattern: config.match.source,
                    name,
                    transform       : config.value || null,
                    lineBreaks      : config.lineBreaks || false,
                    priority        : config.priority ?? (this.calculateBasePriority('regex') + config.match.source.length * 5),
                    originalLength  : config.match.source.length
                }];
            }

            private compileStringArray(name: string, strings: string[]): CompiledRule[] {
                // Sort by length descending to ensure longest match wins
                const sortedStrings = [...strings].sort((a, b) => b.length - a.length);

                // Detect if strings are operators/punctuation vs keywords
                const isKeywordLike = (str: string): boolean => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(str);
                const keywords  = sortedStrings.filter(isKeywordLike);
                const operators = sortedStrings.filter(s => !isKeywordLike(s));

                const results: CompiledRule[] = [];

                // Handle keywords with word boundaries
                if (keywords.length > 0) {
                    const pattern = `\\b(?:${keywords.map(k => this.escapeRegex(k)).join('|')})\\b`;

                    results.push({
                        pattern,
                        name,
                        transform       : null,
                        lineBreaks      : false,
                        priority        : this.calculateBasePriority('keyword') + Math.max(...keywords.map(k => k.length)) * 10,
                        originalLength  : Math.max(...keywords.map(k => k.length))
                    });
                }

                // Handle operators/punctuation without word boundaries
                if (operators.length > 0) {
                    const pattern = `(?:${operators.map(o => this.escapeRegex(o)).join('|')})`;

                    results.push({
                        pattern,
                        name,
                        transform       : null,
                        lineBreaks      : false,
                        priority        : this.calculateBasePriority('operator') + Math.max(...operators.map(o => o.length)) * 10,
                        originalLength  : Math.max(...operators.map(o => o.length))
                    });
                }

                return results;
            }

            private calculateBasePriority(type: 'regex' | 'keyword' | 'operator'): number {
                // Higher numbers = higher priority
                switch (type) {
                    case 'keyword'  : return 1000;  // Keywords should match before identifiers
                    case 'operator' : return 800;   // Multi-char operators before single chars
                    case 'regex'    : return 600;   // Complex patterns
                    default         : return 0;
                }
            }

            private escapeRegex(str: string): string {
                return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }

            *[Symbol.iterator](): Iterator<Token> {
                let token: Token | undefined;
                while ((token = this.next()) !== undefined) { yield token; }
            }

        // └────────────────────────────────────────────────────────────────────┘

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
    export function tokenize(source: string, rules: Rules, options: TokenizeOptions = {}): Token[] {
        // Early return for empty input
        if (source.length === 0) { return []; }

        const tokens: Token[] = [];
        const lexer = new Lexer(rules);
        const { continueOnError = false } = options; // Default: stop at first error (original behavior)

        lexer.setup(source);

        let token = lexer.next();
        while (token !== undefined) {
            tokens.push({
                kind    : token.kind,
                value   : token.value && token.value.length > 0 ? token.value : null,
                span    : token.span
            });

            // Stop on first error (unless continueOnError is true)
            if (token.kind === 'error' && !continueOnError) {
                break;
            }

            token = lexer.next();
        }

        return tokens;
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝