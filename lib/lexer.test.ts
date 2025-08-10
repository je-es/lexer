// lexer.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as lexer from './lexer';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TESTS ═══════════════════════════════════════╗

    describe("lexer", () => {

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
                { "range": { "end": { "col":  4, "line": 1, "offset":  3 }, "start": { "col":  1, "line": 1, "offset":  0 } }, "type": "keyword",   "value": "var" },
                { "range": { "end": { "col":  5, "line": 1, "offset":  4 }, "start": { "col":  4, "line": 1, "offset":  3 } }, "type": "ws",        "value": " " },
                { "range": { "end": { "col":  9, "line": 1, "offset":  8 }, "start": { "col":  5, "line": 1, "offset":  4 } }, "type": "ident",     "value": "name" },
                { "range": { "end": { "col": 10, "line": 1, "offset":  9 }, "start": { "col":  9, "line": 1, "offset":  8 } }, "type": "ws",        "value": " " },
                { "range": { "end": { "col": 11, "line": 1, "offset": 10 }, "start": { "col": 10, "line": 1, "offset":  9 } }, "type": "assign",    "value": "=" },
                { "range": { "end": { "col": 12, "line": 1, "offset": 11 }, "start": { "col": 11, "line": 1, "offset": 10 } }, "type": "ws",        "value": " " },
                { "range": { "end": { "col": 21, "line": 1, "offset": 20 }, "start": { "col": 12, "line": 1, "offset": 11 } }, "type": "string",    "value": "Maysara" },
                { "range": { "end": { "col": 22, "line": 1, "offset": 21 }, "start": { "col": 21, "line": 1, "offset": 20 } }, "type": "scolon",    "value": ";" },
                { "range": { "end": { "col": 32, "line": 1, "offset": 31 }, "start": { "col": 22, "line": 1, "offset": 21 } }, "type": "comment",   "value": "comment" },
                { "range": { "end": { "col":  1, "line": 2, "offset": 32 }, "start": { "col": 32, "line": 1, "offset": 31 } }, "type": "nl",        "value": "\n" },
                { "range": { "end": { "col":  1, "line": 2, "offset": 32 }, "start": { "col":  1, "line": 2, "offset": 32 } }, "type": "error",     "value": "$" }
            ]);
        });

        it("should handle empty input", () => {
            const rules = {
                ident   : /[a-zA-Z]+/
            };

            const tokens = lexer.tokenize('', rules);
            expect(tokens).toEqual([]);
        });

        it("should handle keywords", () => {
            const rules = {
                keyword : ['if', 'else'],
                ident   : /[a-zA-Z]+/,
                ws      : /\s+/
            };

            const tokens = lexer.tokenize('if else foo', rules);
            expect(tokens[0].type ).toBe("keyword");
            expect(tokens[0].value).toBe("if");
            expect(tokens[2].type ).toBe("keyword");
            expect(tokens[2].value).toBe("else");
            expect(tokens[4].type ).toBe("ident");
            expect(tokens[4].value).toBe("foo");
        });

        it("should handle line breaks", () => {
            const rules = {
                ident   : /[a-zA-Z]+/,
                nl      : { match: /\n/, lineBreaks: true }
            };

            const tokens = lexer.tokenize('hello\nworld', rules);
            expect(tokens[0].range.start).toEqual({ line: 1, col: 1, offset: 0 });
            expect(tokens[0].range.end  ).toEqual({ line: 1, col: 6, offset: 5 });
            expect(tokens[1].range.start).toEqual({ line: 1, col: 6, offset: 5 });
            expect(tokens[1].range.end  ).toEqual({ line: 2, col: 1, offset: 6 });
            expect(tokens[2].range.start).toEqual({ line: 2, col: 1, offset: 6 });
            expect(tokens[2].range.end  ).toEqual({ line: 2, col: 6, offset: 11 });
        });

    });

// ╚══════════════════════════════════════════════════════════════════════════════════════╝