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
    A tool for converting text into tokens..!<br>
</p>

<div align="center">
    <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/>
</div>
<br>

<!--------------------------------------------------------------------------->



<!----------------------------------- HMM ----------------------------------->

## .. 🚀

> _For complete context, please refer to [these documents](https://github.com/kemet-lang/.github/blob/main/profile/README.md) first._

```bash
# install using npm
npm install @je-es/lexer
```

```ts
// import using typescript
import { tokenize } from "@je-es/lexer";

// usage
const tokens = tokenize(text, rules);
```

> Example:

```bash
┌─────────────────────────────────────────────────────────┐
│                      "let x = 42;"                      │
└─────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                       PROCESSING                        │
└─────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│     ┌───────┬───────┬─────────┬─────────┬─────────┐     │
│     │ let   │ x     │  =      │ 42      │ ;       │     │
│     │ kw    │ ident │  op     │ number  │ punct   │     │
│     │ 0-3   │ 4-5   │  6-7    │ 8-10    │ 11-12   │     │
│     └───────┴───────┴─────────┴─────────┴─────────┘     │
└─────────────────────────────────────────────────────────┘
```

<br>
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

<!-------------------------------------------------------------------------->