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
    A lightweight, fast, and flexible lexical analyzer for tokenizing source code with zero dependencies.<br>
</p>

<div align="center">
    <img src="https://raw.githubusercontent.com/maysara-elshewehy/SuperZIG-assets/refs/heads/main/dist/img/md/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/>
</div>
<br>

<!--------------------------------------------------------------------------->



<!----------------------------------- API ----------------------------------->

```bash
# Installation
npm install @je-es/lexer
```

```typescript
// Import lexer module
import lexer from '@je-es/lexer';

// Create lexer rules
const rules = lexer.createRules({
    // Basics
    ws              : /[ \t]+/,
    nl              : { match: /\r?\n/,          lineBreaks: true,  value: (text: string) => '\n' },
    comment         : { match: /(?:\/\/(?:.*))/, lineBreaks: false, value: (text: string) => text.slice(2).trim() },

    // Keywords
    keyword         : ['var'],

    // Identifiers & Literals
    ident           : /[a-zA-Z_][a-zA-Z0-9_]*/,
    string          : {
        match: /"(?:[^"\\]|\\.)*"/,
        value: (text: string) => text.slice(1, -1).replace(/\\(.)/g, (_, char) => char)
    },

    // Operators & Punctuation
    scolon          : ';',
    assign          : '=',
});

// Tokenize source code
const tokens = lexer.tokenize(rules, `var name = "Maysara";// comment\n$`);
```

```jsonc
// output
[
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
]
```

<br>
<div align="center">
    <img src="https://raw.githubusercontent.com/maysara-elshewehy/SuperZIG-assets/refs/heads/main/dist/img/md/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/>
</div>

<!--------------------------------------------------------------------------->



<!----------------------------------- API ----------------------------------->

- ### Metadata

    - #### Functions

        ```ts
        // Creates and compiles lexer rules for tokenization
        function createRules(rules: Rules): Rules
        ```


        ```ts
        // Tokenizes source code using the provided rules
        function tokenize(rules: Rules, source: string): Token[]
        ```

    - #### Types

        ```ts
        // Represents a single token with type, value, and position
        interface Token {
            type    : string;
            value   : string | null;
            pos     : { line: number; col: number; }
        }
        ```

        ```ts
        // Advanced rule configuration with custom processing
        interface RuleConfig {
            match: RegExp;
            value?: (text: string) => string;
            lineBreaks?: boolean;
        }
        ```

        ```ts
        // Collection of lexer rules mapping token names to patterns
        interface Rules {
            [key: string]: string | RegExp | string[] | RuleConfig;
        }
        ```

    - #### Rule Types

      - **String**: `'='` - Matches literal text

      - **RegExp**: `/[a-zA-Z]+/` - Matches pattern

      - **Array**: `['if', 'else']` - Matches keywords

      - **Config**: `{ match: /.../, value: fn, lineBreaks: true }` - Advanced rule


<br>
<div align="center">
    <img src="https://raw.githubusercontent.com/maysara-elshewehy/SuperZIG-assets/refs/heads/main/dist/img/md/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/>
</div>

<!--------------------------------------------------------------------------->



<!----------------------------------- END ----------------------------------->

<br>
<div align="center">
    <a href="https://github.com/maysara-elshewehy">
        <img src="https://img.shields.io/badge/Made with ❤️ by-Maysara-orange"/>
    </a>
</div>

<!--------------------------------------------------------------------------->