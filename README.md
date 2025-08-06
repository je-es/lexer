<!----------------------------------- BEG ----------------------------------->
<br>
<div align="center">
    <p>
        <img src="https://raw.githubusercontent.com/je-es/lexer/refs/heads/main/assets/img/logo.png" alt="Lexer" height="80" />
    </p>
</div>

<p align="center">
    <img src="https://img.shields.io/badge/Lite-black"/>
    <img src="https://img.shields.io/badge/Fast-black"/>
    <img src="https://img.shields.io/badge/Flexible-black"/>
    <img src="https://img.shields.io/badge/Zero%20Dependencies-black"/>
</p>

<p align="center" style="font-style:italic; color:gray">
    A fundamental module that scans source text and breaks it down <br>
    into distinct tokens with information about each token's type and position.<br>
    It transforms raw text into a structured representation that can be processed in subsequent stages.
</p>

<div align="center">
    <img src="https://raw.githubusercontent.com/maysara-elshewehy/SuperZIG-assets/refs/heads/main/dist/img/md/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/>
</div>
<br>

<!--------------------------------------------------------------------------->



<!----------------------------------- HOW ----------------------------------->

```bash
npm install @je-es/lexer
```

```typescript
import * as lexer from '@je-es/lexer';
```

- **How to**

    1. #### Create rules

        ```typescript
        const rules : lexer.Rules = {
            // Basics
            ws              : /[ \t]+/,
            nl              : { match: /\r?\n/, lineBreaks: true,  value: (text: string) => '\n' },
            comment         : { match: /(?:\/\/(?:.*))/, value: (text: string) => text.slice(2).trim() },

            // Keywords
            keyword         : ['var'],

            // Identifiers & Literals
            ident           : /[a-zA-Z_][a-zA-Z0-9_]*/,
            string          : { match: /"(?:[^"\\]|\\.)*"/, value: (text: string) => text.slice(1, -1) },

            // Operators & Punctuation
            scolon          : ';',
            assign          : '=',
        };
        ```

    2. #### Tokenize source code

        ```typescript
        const tokens = lexer.tokenize(`var name = "Maysara";// comment\n$`, rules);
        ```

        > **OR, if you prefer to control the tokenization process**

        ```typescript
        // Initialize lexer with rules
        const myLexer = new lexer.Lexer(rules);

        // Setup lexer with input
        myLexer.setup(`var name = "Maysara";// comment\n$`);

        // To store tokens
        const tokens: Token[] = [];

        // Optimized token iteration - avoid iterator overhead
        let token = myLexer.next();
        while (token !== undefined) {
            tokens.push({
                type    : token.type,
                value   : token.value!.length ? token.value : null,
                pos     : token.pos
            });

            // Stop on error to match original behavior
            if (token.type === "error") break;

            token = myLexer.next();
        }

        // Print tokens
        console.log(tokens);
        ```

        ```jsonc
        // Output
        [
            { "type": "keyword",    "value": "var",     "pos": { "line": 1, "col":  1, "offset":  0 } },
            { "type": "ws",         "value": " ",       "pos": { "line": 1, "col":  4, "offset":  3 } },
            { "type": "ident",      "value": "name",    "pos": { "line": 1, "col":  5, "offset":  4 } },
            { "type": "ws",         "value": " ",       "pos": { "line": 1, "col":  9, "offset":  8 } },
            { "type": "assign",     "value": "=",       "pos": { "line": 1, "col": 10, "offset":  9 } },
            { "type": "ws",         "value": " ",       "pos": { "line": 1, "col": 11, "offset": 10 } },
            { "type": "string",     "value": "Maysara", "pos": { "line": 1, "col": 12, "offset": 11 } },
            { "type": "scolon",     "value": ";",       "pos": { "line": 1, "col": 21, "offset": 20 } },
            { "type": "comment",    "value": "comment", "pos": { "line": 1, "col": 22, "offset": 21 } },
            { "type": "nl",         "value": "\n",      "pos": { "line": 1, "col": 32, "offset": 31 } },
            { "type": "error",      "value": "$",       "pos": { "line": 2, "col":  1, "offset": 32 } }
        ]
        ```

<br>
<div align="center">
    <img src="https://raw.githubusercontent.com/maysara-elshewehy/SuperZIG-assets/refs/heads/main/dist/img/md/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/>
</div>

<!--------------------------------------------------------------------------->



<!----------------------------------- API ----------------------------------->

- ### 📖 Metadata

    - #### Functions

        ```ts
        // Tokenizes source code using the provided rules
        function tokenize(source: string, rules: Rules): Token[]
        ```

    - #### Types

        ```ts
        // Lexical analyzer that converts source text into tokens
        class Lexer {
            constructor(rules: Rules);         // Initialize lexer with rules
            setup(source: string): void;       // Setup lexer with input
            next(): Token | undefined;         // Get next token
        }

        // Represents a token with type, value and position information
        interface Token {
            type            : string;          // Token type identifier
            value           : string | null;   // Token value or null
            pos             : {                // Token position
                line: number;                  // Line number (1-based)
                col: number;                   // Column number (1-based)
                offset?: number;               // Character offset in source
            };
        }

        // Configuration for a lexer rule defining how to match and process tokens
        interface RuleConfig {
            match           : RegExp;                       // Pattern to match token
            value          ?: (text: string) => string;     // Optional value transform
            lineBreaks     ?: boolean;                      // Track line breaks in token
        }
        ```

<br>
<div align="center">
    <img src="https://raw.githubusercontent.com/maysara-elshewehy/SuperZIG-assets/refs/heads/main/dist/img/md/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/>
</div>

<!--------------------------------------------------------------------------->



<!----------------------------------- REL ----------------------------------->

- #### 🔗 Related

    - ##### @je-es/lexer
        > Fundamental lexical analyzer that transforms source text into structured tokens with type and position information.

    - ##### [@je-es/parser](https://github.com/je-es/parser)
        > Advanced syntax analyzer that converts tokens into AST with customizable grammar rules and intelligent error detection.

    - ##### [@je-es/syntax](https://github.com/je-es/syntax)
        > Unified interface for creating custom language modes with simplified lexing and parsing capabilities.

<!--------------------------------------------------------------------------->



<!----------------------------------- END ----------------------------------->

<br>
<div align="center">
    <a href="https://github.com/maysara-elshewehy">
        <img src="https://img.shields.io/badge/Made with ❤️ by-Maysara-orange"/>
    </a>
</div>

<!--------------------------------------------------------------------------->