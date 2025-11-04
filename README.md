<!----------------------------------- BEG ----------------------------------->
<br>
<div align="center">
    <p>
        <img src="./assets/img/logo.png" alt="lexer" style="" height="50" />
    </p>
</div>


<div align="center">
    <p align="center" style="font-style:italic; color:gray;">
        A fast, robust lexer designed to perform lexical analysis<br>
        efficiently converting raw text input or source code into a clean, digestible stream of tokens for parsing.
        <br>
    </p>
    <img src="https://img.shields.io/badge/Version-0.1.8-black"/>
    <a href="https://github.com/je-es"><img src="https://img.shields.io/badge/Part_of-@je--es-black"/></a>
    <a href="https://github.com/kemet-lang"><img src="https://img.shields.io/badge/Built_for-@kemet--lang-black"/></a>
</div>


<div align="center">
    <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/>
    <br>
</div>

<!--------------------------------------------------------------------------->



<!----------------------------------- --- ----------------------------------->

- ### Install

    ```bash
    npm install @je-es/lexer
    ```

    ```ts
    import * as Lexer from "@je-es/lexer";
    ```

    <div align="center"> <br> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

- ### Usage

    ```ts
    // [1] create lexer rules
    const lexer_rules : Lexer.Rules = {
        // ═══ Whitespace ═══
        ws              : /\s+/,

        // ═══ Literals ═══
        bin             : /0b[01]+/,
        oct             : /0o[0-7]+/,
        ...

        // ═══ Keywords ═══
        try             : 'try',
        catch           : 'catch',
        ...

        // ═══ Types ═══
        f_type          : ['f16', 'f32', 'f64', 'f80', 'f128'],
        ...

        // ═══ Operators ═══
        '=='            : '==',
        '!='            : '!=',
        ...

        // ═══ Identifier ═══
        ident           : /[a-zA-Z_][a-zA-Z0-9_]*/,
    };
    ```

    ```ts
    // [2] tokenize input using your rules
    const tokens = Lexer.tokenize('<input>', rules);
    ```

    <div align="center"> <br> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>


- ### Related

    - #### [kemet-lang (MVP)](https://github.com/kemet-lang/.github/blob/main/profile/roadmap/MVP.md)

        > #### 1. [`@je-es/lexer`](https://github.com/je-es/lexer)

        > #### 2. [@je-es/parser](https://github.com/je-es/parser)

        > #### 3. [@je-es/syntax](https://github.com/je-es/syntax)

        > #### 4. [@je-es/ast](https://github.com/je-es/ast)

        > #### 5. [@je-es/ast-analyzer](https://github.com/je-es/ast-analyzer)

        > #### 6. [@je-es/project](https://github.com/je-es/project)

        > #### 7. [@je-es/lsp](https://github.com/je-es/lsp)

        > #### 8. [@je-es/codegen](https://github.com/je-es/codegen)

        > #### 9. [@je-es/compiler](https://github.com/je-es/compiler)



<!--------------------------------------------------------------------------->



<!----------------------------------- END ----------------------------------->

<br>
<div align="center">
    <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/>
</div>
<br>

<div align="center">
    <a href="https://github.com/maysara-elshewehy">
        <img src="https://img.shields.io/badge/by-Maysara-blue"/>
    </a>
</div>

<!-------------------------------------------------------------------------->