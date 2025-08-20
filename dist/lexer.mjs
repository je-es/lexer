// lib/lexer.ts
var error = Symbol("error");
var Lexer = class {
  constructor(rules) {
    this.fastRegex = null;
    this.ruleTypes = [];
    this.ruleTransforms = [];
    this.ruleLineBreaks = [];
    this.buffer = "";
    this.position = 0;
    this.length = 0;
    this.compileRules(rules);
  }
  compileRules(rules) {
    const patterns = [];
    const types = [];
    const transforms = [];
    const lineBreaks = [];
    for (const [name, rule] of Object.entries(rules)) {
      let pattern;
      let transform = null;
      let hasLineBreaks = false;
      if (typeof rule === "symbol" && rule === error) {
        continue;
      } else if (typeof rule === "string") {
        pattern = this.escapeRegex(rule);
      } else if (rule instanceof RegExp) {
        pattern = rule.source;
      } else if (Array.isArray(rule)) {
        if (rule.length === 1) {
          pattern = `${this.escapeRegex(rule[0])}(?![a-zA-Z0-9_])`;
        } else {
          pattern = `(?:${rule.map((k) => this.escapeRegex(k)).join("|")})(?![a-zA-Z0-9_])`;
        }
      } else {
        const config = rule;
        pattern = config.match.source;
        transform = config.value || null;
        hasLineBreaks = config.lineBreaks || false;
      }
      patterns.push(`(${pattern})`);
      types.push(name);
      transforms.push(transform);
      lineBreaks.push(hasLineBreaks);
    }
    if (patterns.length > 0) {
      this.fastRegex = new RegExp(patterns.join("|"), "gy");
    }
    this.ruleTypes = types;
    this.ruleTransforms = transforms;
    this.ruleLineBreaks = lineBreaks;
  }
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  setup(input) {
    this.buffer = input;
    this.length = input.length;
    this.position = 0;
    if (this.fastRegex) {
      this.fastRegex.lastIndex = 0;
    }
  }
  next() {
    if (this.position >= this.length) {
      return void 0;
    }
    if (this.fastRegex) {
      this.fastRegex.lastIndex = this.position;
      const match = this.fastRegex.exec(this.buffer);
      if (match && match.index === this.position) {
        let ruleIndex = 0;
        let text = "";
        for (let i = 1; i < match.length; i++) {
          if (match[i] !== void 0) {
            ruleIndex = i - 1;
            text = match[i];
            break;
          }
        }
        const startPos = this.position;
        const textLength = text.length;
        this.position += textLength;
        const transform = this.ruleTransforms[ruleIndex];
        const value = transform ? transform(text) : text;
        return {
          kind: this.ruleTypes[ruleIndex],
          value,
          span: { start: startPos, end: this.position }
        };
      }
    }
    const char = this.buffer[this.position];
    const token = {
      kind: "error",
      value: char,
      span: { start: this.position, end: this.position }
    };
    this.position++;
    return token;
  }
  *[Symbol.iterator]() {
    let token;
    while ((token = this.next()) !== void 0) {
      yield token;
    }
  }
};
function tokenize(source, rules) {
  const sourceLength = source.length;
  if (sourceLength === 0) {
    return [];
  }
  const tokens = [];
  const lexer = new Lexer(rules);
  lexer.setup(source);
  let token = lexer.next();
  while (token !== void 0) {
    tokens.push({
      kind: token.kind,
      value: token.value.length ? token.value : null,
      span: token.span
    });
    if (token.kind === "error") break;
    token = lexer.next();
  }
  return tokens;
}
export {
  Lexer,
  error,
  tokenize
};
//# sourceMappingURL=lexer.mjs.map