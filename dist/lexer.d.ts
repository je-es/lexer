interface Token {
    kind: string;
    value: string | null;
    span: Span;
}
interface Span {
    start: number;
    end: number;
}
interface RuleConfig {
    match: RegExp;
    value?: (text: string) => string;
    lineBreaks?: boolean;
    priority?: number;
}
type Rule = string | RegExp | string[] | RuleConfig;
type Rules = Record<string, Rule>;
interface TokenizeOptions {
    continueOnError?: boolean;
}
interface CompiledRule {
    pattern: string;
    name: string;
    transform: ((text: string) => string) | null;
    lineBreaks: boolean;
    priority: number;
    originalLength: number;
}
declare const error: unique symbol;
declare class Lexer {
    private fastRegex;
    private ruleTypes;
    private ruleTransforms;
    private ruleLineBreaks;
    private buffer;
    private position;
    private length;
    constructor(rules: Rules);
    setup(input: string): void;
    next(): Token | undefined;
    private compileRules;
    private compileRule;
    private compileStringArray;
    private calculateBasePriority;
    private escapeRegex;
    [Symbol.iterator](): Iterator<Token>;
}
/**
* Tokenizes source code using the provided rules
*
* @param source     - The source text to tokenize
* @param rules      - Rules defining how to break the source into tokens
* @param options    - Optional tokenization behavior settings
*
* @returns Array of tokens extracted from the source
*/
declare function tokenize(source: string, rules: Rules, options?: TokenizeOptions): Token[];

export { type CompiledRule, Lexer, type Rule, type RuleConfig, type Rules, type Span, type Token, type TokenizeOptions, error, tokenize };
