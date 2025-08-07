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

## 🚀 Installation

```bash
npm install @je-es/lexer
```

```typescript
import * as lexer from '@je-es/lexer';
```

<br>

## 🌟 How to Use

> Let's say I want to **create a simple syntax** to handle a simple **arithmetic operations groups** like :
>
> `(1 + 2), (4 - 3), ..`
>
> So, I'll need to convert the text into chunks like: (`0-9`, `+`, `-`, `(`, `)`, `,` and `whitespace`).

1. #### Create lexer rules

    ```typescript
    const rules : lexer.Rules = {
        ws      : /\s/,
        num     : /\d/,
        plus    : '+',
        minus   : '-',
        open    : '(',
        close   : ')',
        comma   : ','
    };
    ```

2. #### String to Tokens

    ```typescript
    const tokens = lexer.tokenize(`(1 + 2), (4 - 3)$`, rules);
    ```

    > **or if you prefer to control the tokenization process :**

    ```typescript
    // Initialize lexer with rules
    const myLexer = new lexer.Lexer(rules);

    // Setup lexer with input
    myLexer.setup(`(1 + 2), (4 - 3)$`);

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
        { "type": "open",   "value": "(",   "pos": { "line": 1, "col":  1, "offset":  0 } },
        { "type": "num",    "value": "1",   "pos": { "line": 1, "col":  2, "offset":  1 } },
        { "type": "ws",     "value": " ",   "pos": { "line": 1, "col":  3, "offset":  2 } },
        { "type": "plus",   "value": "+",   "pos": { "line": 1, "col":  4, "offset":  3 } },
        { "type": "ws",     "value": " ",   "pos": { "line": 1, "col":  5, "offset":  4 } },
        { "type": "num",    "value": "2",   "pos": { "line": 1, "col":  6, "offset":  5 } },
        { "type": "close",  "value": ")",   "pos": { "line": 1, "col":  7, "offset":  6 } },
        { "type": "comma",  "value": ",",   "pos": { "line": 1, "col":  8, "offset":  7 } },
        { "type": "ws",     "value": " ",   "pos": { "line": 1, "col":  9, "offset":  8 } },
        { "type": "open",   "value": "(",   "pos": { "line": 1, "col": 10, "offset":  9 } },
        { "type": "num",    "value": "4",   "pos": { "line": 1, "col": 11, "offset": 10 } },
        { "type": "ws",     "value": " ",   "pos": { "line": 1, "col": 12, "offset": 11 } },
        { "type": "minus",  "value": "-",   "pos": { "line": 1, "col": 13, "offset": 12 } },
        { "type": "ws",     "value": " ",   "pos": { "line": 1, "col": 14, "offset": 13 } },
        { "type": "num",    "value": "3",   "pos": { "line": 1, "col": 15, "offset": 14 } },
        { "type": "close",  "value": ")",   "pos": { "line": 1, "col": 16, "offset": 15 } },
        { "type": "error",  "value": "$",   "pos": { "line": 1, "col": 17, "offset": 16 } }
    ]
    ```

3. #### Tokens to Abstract Syntax Tree (AST)

    > For the next steps, please see the [`@je-es/parser`](https://github.com/je-es/parser) package.

<br>

<!--------------------------------------------------------------------------->



<!----------------------------------- API ----------------------------------->

## 📖 API Reference

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