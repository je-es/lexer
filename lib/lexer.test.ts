// lexer.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as lexer from './lexer';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TESTS ═══════════════════════════════════════╗

    describe("lexer", () => {

        it("should tokenize basic example", () => {
            const rules = lexer.createRules({
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
            });

            const tokens = lexer.tokenize(rules, `var name = "Maysara";// comment\n$`);

            expect(tokens).toEqual([
                { "type": "keyword",    "value": "var",         "pos": { "line": 1, "col":  1 } },
                { "type": "ws",         "value": " ",           "pos": { "line": 1, "col":  4 } },
                { "type": "ident",      "value": "name",        "pos": { "line": 1, "col":  5 } },
                { "type": "ws",         "value": " ",           "pos": { "line": 1, "col":  9 } },
                { "type": "assign",     "value": "=",           "pos": { "line": 1, "col": 10 } },
                { "type": "ws",         "value": " ",           "pos": { "line": 1, "col": 11 } },
                { "type": "string",     "value": "Maysara",     "pos": { "line": 1, "col": 12 } },
                { "type": "scolon",     "value": ";",           "pos": { "line": 1, "col": 21 } },
                { "type": "comment",    "value": "comment",     "pos": { "line": 1, "col": 22 } },
                { "type": "nl",         "value": "\n",          "pos": { "line": 1, "col": 32 } },
                { "type": "error",      "value": "$",           "pos": { "line": 2, "col":  1 } }
            ]);
        });

        it("should handle empty input", () => {
            const rules = lexer.createRules({
                ident   : /[a-zA-Z]+/
            });

            const tokens = lexer.tokenize(rules, '');
            expect(tokens).toEqual([]);
        });

        it("should handle keywords", () => {
            const rules = lexer.createRules({
                keyword : ['if', 'else'],
                ident   : /[a-zA-Z]+/,
                ws      : /\s+/
            });

            const tokens = lexer.tokenize(rules, 'if else foo');
            expect(tokens[0].type ).toBe("keyword");
            expect(tokens[0].value).toBe("if");
            expect(tokens[2].type ).toBe("keyword");
            expect(tokens[2].value).toBe("else");
            expect(tokens[4].type ).toBe("ident");
            expect(tokens[4].value).toBe("foo");
        });

        it("should handle line breaks", () => {
            const rules = lexer.createRules({
                ident   : /[a-zA-Z]+/,
                nl      : { match: /\n/, lineBreaks: true }
            });

            const tokens = lexer.tokenize(rules, 'hello\nworld');
            expect(tokens[0].pos).toEqual({ line: 1, col: 1 });
            expect(tokens[1].pos).toEqual({ line: 1, col: 6 });
            expect(tokens[2].pos).toEqual({ line: 2, col: 1 });
        });

    });

// ╚══════════════════════════════════════════════════════════════════════════════════════╝