// lib/lexer.ts
var error = Symbol("error");
var Lexer = class {
  constructor(rules) {
    // ┌──────────────────────────────── INIT ──────────────────────────────┐
    this.fastRegex = null;
    this.ruleTypes = [];
    this.ruleTransforms = [];
    this.ruleLineBreaks = [];
    // [TODO] review it.
    this.buffer = "";
    this.position = 0;
    this.length = 0;
    this.compileRules(rules);
  }
  // └────────────────────────────────────────────────────────────────────┘
  // ┌──────────────────────────────── MAIN ──────────────────────────────┐
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
        let ruleIndex = -1;
        let text = "";
        for (let i = 1; i < match.length; i++) {
          if (match[i] !== void 0) {
            ruleIndex = i - 1;
            text = match[i];
            break;
          }
        }
        if (ruleIndex >= 0) {
          const startPos2 = this.position;
          this.position += text.length;
          const transform = this.ruleTransforms[ruleIndex];
          const value = transform ? transform(text) : text;
          return {
            kind: this.ruleTypes[ruleIndex],
            value: value || null,
            span: { start: startPos2, end: this.position }
          };
        }
      }
    }
    const char = this.buffer[this.position];
    const startPos = this.position;
    this.position++;
    return {
      kind: "error",
      value: char,
      span: { start: startPos, end: this.position }
    };
  }
  // └────────────────────────────────────────────────────────────────────┘
  // ┌──────────────────────────────── HELP ──────────────────────────────┐
  compileRules(rules) {
    const compiledRules = [];
    for (const [name, rule] of Object.entries(rules)) {
      if (typeof rule === "string") {
        rules[name] = [rule];
      }
    }
    for (const [name, rule] of Object.entries(rules)) {
      if (typeof rule === "symbol" && rule === error) {
        continue;
      }
      const compiled = this.compileRule(name, rule);
      compiledRules.push(...compiled);
    }
    compiledRules.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      if (a.originalLength !== b.originalLength) {
        return b.originalLength - a.originalLength;
      }
      return a.name.localeCompare(b.name);
    });
    const patterns = [];
    const types = [];
    const transforms = [];
    const lineBreaks = [];
    for (const rule of compiledRules) {
      patterns.push(`(${rule.pattern})`);
      types.push(rule.name);
      transforms.push(rule.transform);
      lineBreaks.push(rule.lineBreaks);
    }
    if (patterns.length > 0) {
      this.fastRegex = new RegExp(patterns.join("|"), "gy");
    }
    this.ruleTypes = types;
    this.ruleTransforms = transforms;
    this.ruleLineBreaks = lineBreaks;
  }
  compileRule(name, rule) {
    var _a;
    if (typeof rule === "string") {
      throw new Error("String rules should be converted to string arrays before compilation.");
    }
    if (rule instanceof RegExp) {
      return [{
        pattern: rule.source,
        name,
        transform: null,
        lineBreaks: false,
        priority: this.calculateBasePriority("regex") + rule.source.length * 5,
        originalLength: rule.source.length
      }];
    }
    if (Array.isArray(rule)) {
      return this.compileStringArray(name, rule);
    }
    const config = rule;
    return [{
      pattern: config.match.source,
      name,
      transform: config.value || null,
      lineBreaks: config.lineBreaks || false,
      priority: (_a = config.priority) != null ? _a : this.calculateBasePriority("regex") + config.match.source.length * 5,
      originalLength: config.match.source.length
    }];
  }
  compileStringArray(name, strings) {
    const sortedStrings = [...strings].sort((a, b) => b.length - a.length);
    const isKeywordLike = (str) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(str);
    const keywords = sortedStrings.filter(isKeywordLike);
    const operators = sortedStrings.filter((s) => !isKeywordLike(s));
    const results = [];
    if (keywords.length > 0) {
      const pattern = `\\b(?:${keywords.map((k) => this.escapeRegex(k)).join("|")})\\b`;
      results.push({
        pattern,
        name,
        transform: null,
        lineBreaks: false,
        priority: this.calculateBasePriority("keyword") + Math.max(...keywords.map((k) => k.length)) * 10,
        originalLength: Math.max(...keywords.map((k) => k.length))
      });
    }
    if (operators.length > 0) {
      const pattern = `(?:${operators.map((o) => this.escapeRegex(o)).join("|")})`;
      results.push({
        pattern,
        name,
        transform: null,
        lineBreaks: false,
        priority: this.calculateBasePriority("operator") + Math.max(...operators.map((o) => o.length)) * 10,
        originalLength: Math.max(...operators.map((o) => o.length))
      });
    }
    return results;
  }
  calculateBasePriority(type) {
    switch (type) {
      case "keyword":
        return 1e3;
      // Keywords should match before identifiers
      case "operator":
        return 800;
      // Multi-char operators before single chars
      case "regex":
        return 600;
      // Complex patterns
      case "string":
        return 400;
      // Simple strings
      default:
        return 0;
    }
  }
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  *[Symbol.iterator]() {
    let token;
    while ((token = this.next()) !== void 0) {
      yield token;
    }
  }
  // └────────────────────────────────────────────────────────────────────┘
};
function tokenize(source, rules, options = {}) {
  if (source.length === 0) {
    return [];
  }
  const tokens = [];
  const lexer = new Lexer(rules);
  const { continueOnError = false } = options;
  lexer.setup(source);
  let token = lexer.next();
  while (token !== void 0) {
    tokens.push({
      kind: token.kind,
      value: token.value && token.value.length > 0 ? token.value : null,
      span: token.span
    });
    if (token.kind === "error" && !continueOnError) {
      break;
    }
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