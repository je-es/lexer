<!----------------------------------- BEG ----------------------------------->
<br>
<div align="center">
    <p>
        <img src="./assets/img/logo.png" alt="lexer" height="80" />
    </p>
</div>

<div align="center">
    <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/>
</div>

<p align="center" style="font-style:italic; color:gray;">
    <br>
    A tool for converting text into tokens..!
    <br>
</p>

<div align="center">
    <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/>
</div>
<br>

<!--------------------------------------------------------------------------->



<!----------------------------------- HMM ----------------------------------->

## [1] [`@je-es/lexer`](https://github.com/je-es/lexer) 🚀

> _To understand the full context, please refer to [these documents](https://github.com/kemet-lang/.github/blob/main/profile/README.md)._

- ### Install

    ```bash
    npm install @je-es/lexer
    ```

    ```ts
    import * as Lexer from "@je-es/lexer";
    ```

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

---


> #### 1. [`@je-es/lexer`](https://github.com/je-es/lexer)

> #### 2. [@je-es/parser](https://github.com/je-es/parser)

> #### 3. [@je-es/syntax](https://github.com/je-es/syntax)

> #### 4. [@je-es/ast](https://github.com/je-es/ast)

> #### 5. [@je-es/ast-analyzer](https://github.com/je-es/ast-analyzer)


<div align="center">
    <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/>
</div>

<p align="center">
    <b>
        <br>
        <i style="color: gray;">"
        Currently I'm working on a larger project, so I'll skip writing documentation for now due to time constraints.
        "</i>
        <br>
    </b>
</p>

<div align="center">
    <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/>
</div>

<!--------------------------------------------------------------------------->



<!----------------------------------- END ----------------------------------->

<br>
<div align="center">
    <a href="https://github.com/maysara-elshewehy">
        <img src="https://img.shields.io/badge/Made with ❤️ by-Maysara-blue"/>
    </a>
</div>

<!-------------------------------------------------------------------------->