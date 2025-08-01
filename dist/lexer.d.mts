interface Token$1 {
    type: string;
    value: string;
    offset: number;
    line: number;
    col: number;
}
interface RuleConfig {
    match: RegExp;
    value?: (text: string) => string;
    lineBreaks?: boolean;
}
type Rule = string | RegExp | string[] | RuleConfig;
interface Rules$1 {
    [key: string]: Rule;
}
declare class Lexer {
    private fastRegex;
    private ruleTypes;
    private ruleTransforms;
    private ruleLineBreaks;
    private buffer;
    private position;
    private line;
    private col;
    private length;
    constructor(rules: Rules$1);
    private compileRules;
    private escapeRegex;
    reset(input: string): void;
    next(): Token$1 | undefined;
    [Symbol.iterator](): Iterator<Token$1>;
}
declare function compile(rules: Rules$1): Lexer;

interface Token {
    type: string;
    value: string | null;
    pos: {
        line: number;
        col: number;
    };
}
type Rules = Lexer;
declare const error: symbol;
/**
 * Creates lexer rules for tokenizing source code.
 *
 * @param rules - An object containing lexer rules for different token types.
 *
 * @returns A lexer that can tokenize source code.
 */
declare const createRules: typeof compile;
/**
 * Tokenizes the given source code using the provided lexer rules.
 * Optimized version that pre-allocates token array and avoids unnecessary checks.
 *
 * @param rules         - The lexer rules to apply for tokenizing the source code.
 * @param source_code   - The source code to be tokenized.
 *
 * @returns An array of tokens, each with its type, value, and position.
 */
declare function tokenize(rules: Rules, source_code: string): Token[];
declare const _default: {
    createRules: typeof compile;
    error: symbol;
    tokenize: typeof tokenize;
};

export { type Rules, type Token, createRules, _default as default, error, tokenize };
