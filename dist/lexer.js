"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/lexer.ts
var lexer_exports = {};
__export(lexer_exports, {
  Lexer: () => Lexer,
  error: () => error,
  tokenize: () => tokenize
});
module.exports = __toCommonJS(lexer_exports);
var error = Symbol("error");
var Lexer = class {
  constructor(rules) {
    this.fastRegex = null;
    this.ruleTypes = [];
    this.ruleTransforms = [];
    this.ruleLineBreaks = [];
    this.buffer = "";
    this.position = 0;
    this.line = 1;
    this.col = 1;
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
    this.line = 1;
    this.col = 1;
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
        const startLine = this.line;
        const startCol = this.col;
        const startPos = this.position;
        const textLength = text.length;
        this.position += textLength;
        if (this.ruleLineBreaks[ruleIndex]) {
          for (let i = 0; i < textLength; i++) {
            if (text.charCodeAt(i) === 10) {
              this.line++;
              this.col = 1;
            } else {
              this.col++;
            }
          }
        } else {
          this.col += textLength;
        }
        const transform = this.ruleTransforms[ruleIndex];
        const value = transform ? transform(text) : text;
        return {
          type: this.ruleTypes[ruleIndex],
          value,
          range: {
            start: { line: startLine, col: startCol, offset: startPos },
            end: { line: this.line, col: this.col, offset: this.position }
          }
        };
      }
    }
    const char = this.buffer[this.position];
    const token = {
      type: "error",
      value: char,
      range: {
        start: { line: this.line, col: this.col, offset: this.position },
        end: { line: this.line, col: this.col, offset: this.position }
      }
    };
    this.position++;
    this.col++;
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
      type: token.type,
      value: token.value.length ? token.value : null,
      range: token.range
    });
    if (token.type === "error") break;
    token = lexer.next();
  }
  return tokens;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Lexer,
  error,
  tokenize
});
//# sourceMappingURL=lexer.js.map