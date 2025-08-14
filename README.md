<!----------------------------------- BEG ----------------------------------->
<br>
<div align="center">
    <p>
        <img src="./assets/img/logo.png" alt="lexer" height="80" />
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
    <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/>
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
            span    : token.span
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
        // Initialize lexer with rules
        constructor(rules: Rules);

        // Setup lexer with input
        setup(source: string): void;

        // Get next token
        next(): Token | undefined;
    }

    // Represents a token with type, value and position information
    interface Token {
        type            : string;           // Token type identifier
        value           : string | null;    // Token value or null
        span            : Span;             // Token span in source text
    }

    // Represents a span in the source text
    interface Span {
        start           : number;
        end             : number;
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
<img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/>
</div>

<!--------------------------------------------------------------------------->



<!----------------------------------- REL ----------------------------------->

- #### 🔗 Related

  - ##### @je-es/lexer
      > Fundamental lexical analyzer that transforms source text into structured tokens with type and position information.

  - ##### [@je-es/parser](https://github.com/je-es/parser)
      > Advanced syntax analyzer that converts tokens into AST with customizable grammar rules and intelligent error detection.

  - ##### [@je-es/syntax](https://github.com/je-es/syntax)
      > Unified wrapper that streamlines syntax creation with integrated lexer-parser coordination, LSP support, and enhanced linting capabilities.


<br>
<div align="center">
    <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/>
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