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
                { "type": "keyword",   "value": "var",      "span": { "start":  0, "end":  3 } },
                { "type": "ws",        "value": " ",        "span": { "start":  3, "end":  4 } },
                { "type": "ident",     "value": "name",     "span": { "start":  4, "end":  8 } },
                { "type": "ws",        "value": " ",        "span": { "start":  8, "end":  9 } },
                { "type": "assign",    "value": "=",        "span": { "start":  9, "end": 10 } },
                { "type": "ws",        "value": " ",        "span": { "start": 10, "end": 11 } },
                { "type": "string",    "value": "Maysara",  "span": { "start": 11, "end": 20 } },
                { "type": "scolon",    "value": ";",        "span": { "start": 20, "end": 21 } },
                { "type": "comment",   "value": "comment",  "span": { "start": 21, "end": 31 } },
                { "type": "nl",        "value": "\n",       "span": { "start": 31, "end": 32 } },
                { "type": "error",     "value": "$",        "span": { "start": 32, "end": 32 } }
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
            expect(tokens[0].span.start).toEqual(0);
            expect(tokens[0].span.end  ).toEqual(5);
            expect(tokens[1].span.start).toEqual(5);
            expect(tokens[1].span.end  ).toEqual(6);
            expect(tokens[2].span.start).toEqual(6);
            expect(tokens[2].span.end  ).toEqual(11);
        });

    });

// ╚══════════════════════════════════════════════════════════════════════════════════════╝