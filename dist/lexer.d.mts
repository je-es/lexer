type ValueType = string | null;
interface Token {
    type: string;
    value: ValueType;
    pos: {
        line: number;
        col: number;
        offset?: number;
    };
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
declare function tokenize(source: string, rules: Rules): Token[];

export { Lexer, type Rule, type RuleConfig, type Rules, type Token, type ValueType, error, tokenize };
