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
    into distinct tokens with information about each token's type and range.<br>
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
            range   : token.range
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
        { "type": "keyword",   "value": "var",      "range": { .. } },
        { "type": "ws",        "value": " ",        "range": { .. } },
        { "type": "ident",     "value": "name",     "range": { .. } },
        { "type": "ws",        "value": " ",        "range": { .. } },
        { "type": "assign",    "value": "=",        "range": { .. } },
        { "type": "ws",        "value": " ",        "range": { .. } },
        { "type": "string",    "value": "Maysara",  "range": { .. } },
        { "type": "scolon",    "value": ";",        "range": { .. } },
        { "type": "comment",   "value": "comment",  "range": { .. } },
        { "type": "nl",        "value": "\n",       "range": { .. } },
        { "type": "error",     "value": "$",        "range": { .. } }
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
        range           : Range;            // Token range in source text
    }

    // Represents a position in the source text
    interface Position {
        line            : number;
        col             : number;
        offset          : number;
    }

    // Represents a range in the source text
    interface Range {
        start           : Position;
        end             : Position;
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
      > Fundamental lexical analyzer that transforms source text into structured tokens with type and range/position information.

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