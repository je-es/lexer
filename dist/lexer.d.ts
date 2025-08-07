/** Represents a token with type, value and position information */
interface Token {
    type: string;
    value: string | null;
    pos: Position;
}
/** Represents a position in the source text */
interface Position {
    line: number;
    col: number;
    offset: number;
}
/** Configuration for a lexer rule defining how to match and process tokens */
interface RuleConfig {
    match: RegExp;
    value?: (text: string) => string;
    lineBreaks?: boolean;
}
/** Defines a rule that can be a string, RegExp, string array, or RuleConfig */
type Rule = string | RegExp | string[] | RuleConfig;
/** Collection of named rules for tokenization */
interface Rules {
    [key: string]: Rule;
}
declare const error: unique symbol;
/**
 * Lexical analyzer that converts source text into tokens
 *
 * The lexer processes input text according to defined rules and produces
 * a stream of tokens with type and position information.
*/
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
 * @param source    - The source text to tokenize
 * @param rules     - Rules defining how to break the source into tokens
 *
 * @returns Array of tokens extracted from the source
*/
declare function tokenize(source: string, rules: Rules): Token[];

export { Lexer, type Position, type Rule, type RuleConfig, type Rules, type Token, error, tokenize };
