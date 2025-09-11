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
}
type Rule = string | RegExp | string[] | RuleConfig;
interface Rules {
    [key: string]: Rule;
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
    private compileRules;
    private escapeRegex;
    setup(input: string): void;
    next(): Token | undefined;
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
declare function tokenize(source: string, rules: Rules): Token[];

export { Lexer, type Rule, type RuleConfig, type Rules, type Span, type Token, error, tokenize };
