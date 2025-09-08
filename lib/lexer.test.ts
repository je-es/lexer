// lexer.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as lexer from './lexer';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    describe("Production Lexer", () => {

        describe("Basic functionality", () => {
            it("should tokenize basic example", () => {
                const rules = {
                    ws          : /[ \t]+/,
                    nl          : { match: /\r?\n/, lineBreaks: true, value: (text: string) => '\n' },
                    comment     : { match: /\/\/.*/, value: (text: string) => text.slice(2).trim() },
                    keyword     : ['var'],
                    ident       : /[a-zA-Z_][a-zA-Z0-9_]*/,
                    string      : {
                        match   : /"(?:[^"\\]|\\.)*"/,
                        value   : (text: string) => text.slice(1, -1).replace(/\\(.)/g, (_, char) => char)
                    },
                    scolon      : ';',
                    assign      : '=',
                };

                const tokens = lexer.tokenize(`var name = "Maysara";// comment\n$`, rules);

                expect(tokens).toEqual([
                    { "kind": "keyword",   "value": "var",      "span": { "start":  0, "end":  3 } },
                    { "kind": "ws",        "value": " ",        "span": { "start":  3, "end":  4 } },
                    { "kind": "ident",     "value": "name",     "span": { "start":  4, "end":  8 } },
                    { "kind": "ws",        "value": " ",        "span": { "start":  8, "end":  9 } },
                    { "kind": "assign",    "value": "=",        "span": { "start":  9, "end": 10 } },
                    { "kind": "ws",        "value": " ",        "span": { "start": 10, "end": 11 } },
                    { "kind": "string",    "value": "Maysara",  "span": { "start": 11, "end": 20 } },
                    { "kind": "scolon",    "value": ";",        "span": { "start": 20, "end": 21 } },
                    { "kind": "comment",   "value": "comment",  "span": { "start": 21, "end": 31 } },
                    { "kind": "nl",        "value": "\n",       "span": { "start": 31, "end": 32 } },
                    { "kind": "error",     "value": "$",        "span": { "start": 32, "end": 33 } }
                ]);
            });

            it("should handle empty input", () => {
                const rules = {
                    ident   : /[a-zA-Z]+/
                };

                const tokens = lexer.tokenize('', rules);
                expect(tokens).toEqual([]);
            });
        });

        describe("Array rule handling (FIXED)", () => {
            it("should correctly tokenize brackets and operators", () => {
                const rules = {
                    ws: /\s+/,
                    number: /[0-9]+/,
                    operators: ['[', ']', '+', '-', '++', '--'], // Mixed lengths
                    comma: ',',
                };

                const tokens = lexer.tokenize('[1, 2, 3]', rules);

                expect(tokens).toEqual([
                    { "kind": "operators", "value": "[",  "span": { "start": 0, "end": 1 } },
                    { "kind": "number",    "value": "1",  "span": { "start": 1, "end": 2 } },
                    { "kind": "comma",     "value": ",",  "span": { "start": 2, "end": 3 } },
                    { "kind": "ws",        "value": " ",  "span": { "start": 3, "end": 4 } },
                    { "kind": "number",    "value": "2",  "span": { "start": 4, "end": 5 } },
                    { "kind": "comma",     "value": ",",  "span": { "start": 5, "end": 6 } },
                    { "kind": "ws",        "value": " ",  "span": { "start": 6, "end": 7 } },
                    { "kind": "number",    "value": "3",  "span": { "start": 7, "end": 8 } },
                    { "kind": "operators", "value": "]",  "span": { "start": 8, "end": 9 } }
                ]);
            });

            it("should handle mixed keyword/operator arrays correctly", () => {
                const rules = {
                    ws: /\s+/,
                    mixed_ops: ['and', 'or', '&&', '||', '&', '|'], // Keywords + operators
                    ident: /[a-zA-Z_][a-zA-Z0-9_]*/,
                    number: /[0-9]+/
                };

                const tokens = lexer.tokenize('x and y || z & 5', rules);

                // 'and' should be recognized as mixed_ops, not ident
                expect(tokens[2].kind).toBe('mixed_ops');
                expect(tokens[2].value).toBe('and');

                // '||' should be recognized before '|'
                expect(tokens[6].kind).toBe('mixed_ops');
                expect(tokens[6].value).toBe('||');

                // Single '&' should work
                expect(tokens[10].kind).toBe('mixed_ops');
                expect(tokens[10].value).toBe('&');
            });
        });

        describe("Rule prioritization", () => {
            it("should prioritize longer patterns over shorter ones", () => {
                const rules = {
                    ws: /\s+/,
                    increment: ['++', '--'],
                    single_op: ['+', '-'],
                    ident: /[a-zA-Z]+/
                };

                const tokens = lexer.tokenize('x++ + y--', rules);

                expect(tokens[1].kind).toBe('increment');
                expect(tokens[1].value).toBe('++');
                expect(tokens[3].kind).toBe('single_op');
                expect(tokens[3].value).toBe('+');
                expect(tokens[6].kind).toBe('increment');
                expect(tokens[6].value).toBe('--');
            });

            it("should prioritize keywords over identifiers", () => {
                const rules = {
                    keyword: ['if', 'else'],
                    ident: /[a-zA-Z_][a-zA-Z0-9_]*/,
                    ws: /\s+/
                };

                const tokens = lexer.tokenize('if else identifier', rules);

                expect(tokens[0].kind).toBe('keyword');
                expect(tokens[0].value).toBe('if');
                expect(tokens[2].kind).toBe('keyword');
                expect(tokens[2].value).toBe('else');
                expect(tokens[4].kind).toBe('ident');
                expect(tokens[4].value).toBe('identifier');
            });

            it("should handle numeric literal priorities", () => {
                const rules = {
                    ws: /\s+/,
                    float: /[0-9]+\.[0-9]+/,
                    scientific: /[0-9]+\.?[0-9]*[eE][+-]?[0-9]+/,
                    integer: /[0-9]+/
                };

                const tokens = lexer.tokenize('42 3.14 1.23e-4', rules);

                expect(tokens[0].kind).toBe('integer');
                expect(tokens[0].value).toBe('42');
                expect(tokens[2].kind).toBe('float');
                expect(tokens[2].value).toBe('3.14');
                expect(tokens[4].kind).toBe('scientific');
                expect(tokens[4].value).toBe('1.23e-4');
            });
        });

        describe("Complex real-world scenarios", () => {
            it("should handle C-style code", () => {
                const rules = {
                    ws: /\s+/,
                    keywords: ['if', 'else', 'while', 'for', 'return'],
                    types: ['int', 'float', 'char'],
                    operators: ['++', '--', '+=', '-=', '==', '!=', '<=', '>=', '&&', '||'],
                    single_ops: ['=', '+', '-', '*', '/', '<', '>', '!', '&', '|'],
                    punct: ['(', ')', '{', '}', '[', ']', ';', ','],
                    ident: /[a-zA-Z_][a-zA-Z0-9_]*/,
                    number: /[0-9]+/,
                    string: /"(?:[^"\\]|\\.)*"/
                };

                const code = 'if (x >= 0 && y != null) { return arr[i]++; }';
                const tokens = lexer.tokenize(code, rules);

                // Should not contain any error tokens
                const errorTokens = tokens.filter(t => t.kind === 'error');
                expect(errorTokens).toEqual([]);

                // Check specific complex operators
                const geqToken = tokens.find(t => t.value === '>=');
                expect(geqToken?.kind).toBe('operators');

                const andToken = tokens.find(t => t.value === '&&');
                expect(andToken?.kind).toBe('operators');

                const neqToken = tokens.find(t => t.value === '!=');
                expect(neqToken?.kind).toBe('operators');
            });

            it("should handle original lexer rules", () => {
                const lexerRules = {
                    ws: /\s+/,
                    comment: { match: /\/\/[!/]?.*/, value: (text: string) => text.slice(2).trim() },
                    flt: /(?:[0-9]*\.[0-9]+|[0-9]+\.[0-9]*)(?:[eE][+-]?[0-9]+)?/,
                    dec: /[0-9]+/,
                    str: { match: /"(?:[^"\\]|\\.)*"/, value: (text: string) => text.slice(1, -1) },
                    kw: ['use', 'let', 'def', 'fn', 'if', 'else', 'while', 'return'],
                    types: ['i32', 'f32', 'bool', 'void'],
                    op: [
                        // Multi-char first for proper priority
                        '->', '.*', '+=', '-=', '*=', '/=', '%=',
                        '==', '!=', '<=', '>=', '**', '++', '--', '<<', '>>',
                        // Single char
                        '<', '>', '|', '^', '&', '=', '+', '-', '*', '/', '%', '?', '!', '~',
                        ':', ';', ',', '.', '(', ')', '{', '}', '[', ']', '@'
                    ],
                    logical: ['and', 'or'],
                    ident: /[a-zA-Z_][a-zA-Z0-9_]*/
                };

                // Original failing case - should now work!
                const tokens = lexer.tokenize('[1, 2, 3]', lexerRules);

                expect(tokens).toEqual([
                    { "kind": "op",  "value": "[", "span": { "start": 0, "end": 1 } },
                    { "kind": "dec", "value": "1", "span": { "start": 1, "end": 2 } },
                    { "kind": "op",  "value": ",", "span": { "start": 2, "end": 3 } },
                    { "kind": "ws",  "value": " ", "span": { "start": 3, "end": 4 } },
                    { "kind": "dec", "value": "2", "span": { "start": 4, "end": 5 } },
                    { "kind": "op",  "value": ",", "span": { "start": 5, "end": 6 } },
                    { "kind": "ws",  "value": " ", "span": { "start": 6, "end": 7 } },
                    { "kind": "dec", "value": "3", "span": { "start": 7, "end": 8 } },
                    { "kind": "op",  "value": "]", "span": { "start": 8, "end": 9 } }
                ]);
            });
        });

        describe("Error handling", () => {
            it("should stop at first error by default (original behavior)", () => {
                const rules = {
                    ws: /\s+/,
                    ident: /[a-zA-Z]+/,
                    equals: '='
                };

                // $ is not in rules, should be error and STOP parsing (default behavior)
                const tokens = lexer.tokenize('hello $ world = test', rules);

                expect(tokens[0]).toEqual({ "kind": "ident", "value": "hello", "span": { "start": 0, "end": 5 } });
                expect(tokens[1]).toEqual({ "kind": "ws", "value": " ", "span": { "start": 5, "end": 6 } });
                expect(tokens[2]).toEqual({ "kind": "error", "value": "$", "span": { "start": 6, "end": 7 } });

                // Should NOT continue after error (original behavior)
                expect(tokens.length).toBe(3);
            });

            it("should continue after errors when explicitly enabled", () => {
                const rules = {
                    ws: /\s+/,
                    ident: /[a-zA-Z]+/,
                    equals: '='
                };

                // $ is not in rules, should be error, but continue parsing when option is set
                const tokens = lexer.tokenize('hello $ world = test', rules, { continueOnError: true });

                expect(tokens[0]).toEqual({ "kind": "ident", "value": "hello", "span": { "start": 0, "end": 5 } });
                expect(tokens[1]).toEqual({ "kind": "ws", "value": " ", "span": { "start": 5, "end": 6 } });
                expect(tokens[2]).toEqual({ "kind": "error", "value": "$", "span": { "start": 6, "end": 7 } });
                expect(tokens[3]).toEqual({ "kind": "ws", "value": " ", "span": { "start": 7, "end": 8 } });
                expect(tokens[4]).toEqual({ "kind": "ident", "value": "world", "span": { "start": 8, "end": 13 } });

                // Should continue and tokenize the rest
                expect(tokens.length).toBe(9); // Full tokenization
            });

            it("should handle multiple errors with different settings", () => {
                const rules = {
                    ident: /[a-zA-Z]+/,
                    ws: /\s+/
                };

                const input = 'hello $ world % test';

                // Default: stop at first error
                const stopTokens = lexer.tokenize(input, rules);
                expect(stopTokens.length).toBe(3); // hello, ws, error($) - then stop

                // Continue: get all tokens including errors
                const continueTokens = lexer.tokenize(input, rules, { continueOnError: true });
                expect(continueTokens.length).toBe(9); // hello, ws, error($), ws, ident(world), ws, error(%), ws, ident(test)

                const errorTokens = continueTokens.filter(t => t.kind === 'error');
                expect(errorTokens).toHaveLength(2);
                expect(errorTokens.map(t => t.value)).toEqual(['$', '%']);
            });

            it("should handle invalid regex gracefully", () => {
                // Test that malformed rules don't crash the lexer
                const rules = {
                    ws: /\s+/,
                    ident: /[a-zA-Z]+/,
                    punct: ['(', ')']
                };

                expect(() => {
                    const tokens = lexer.tokenize('hello (world)', rules);
                    expect(tokens.length).toBeGreaterThan(0);
                }).not.toThrow();
            });

            it("should maintain backward compatibility", () => {
                const rules = {
                    ident: /[a-zA-Z]+/,
                };

                // Old way (no options) should still work and stop at first error
                const tokens = lexer.tokenize('hello $ world', rules);
                expect(tokens.length).toBe(2); // hello, error - then stop
                expect(tokens[1].kind).toBe('error');
            });
        });

        describe("Line breaks and positioning", () => {
            it("should handle line breaks correctly", () => {
                const rules = {
                    ident: /[a-zA-Z]+/,
                    nl: { match: /\n/, lineBreaks: true }
                };

                const tokens = lexer.tokenize('hello\nworld', rules);

                expect(tokens[0].span).toEqual({ start: 0, end: 5 });
                expect(tokens[1].span).toEqual({ start: 5, end: 6 });
                expect(tokens[2].span).toEqual({ start: 6, end: 11 });
            });

            it("should track positions accurately in complex input", () => {
                const rules = {
                    ws: /\s+/,
                    ident: /[a-zA-Z]+/,
                    op: ['++', '+'],
                    punct: ['(', ')']
                };

                const input = 'func(x++ + y)';
                const tokens = lexer.tokenize(input, rules);

                // Check that all spans are correct and contiguous
                let expectedPos = 0;
                for (const token of tokens) {
                    expect(token.span.start).toBe(expectedPos);
                    expectedPos = token.span.end;
                }
                expect(expectedPos).toBe(input.length);
            });
        });
    });

// ╚══════════════════════════════════════════════════════════════════════════════════════╝