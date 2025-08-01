// tsup.config.ts — Configuration for `tsup`.
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import { defineConfig } from 'tsup';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    export default defineConfig
    ({
        entry                           : ["lib/lexer.ts"],
        format                          : ["cjs", "esm"],
        dts                             : true,
        splitting                       : false,
        sourcemap                       : true,
        clean                           : true,
    });

// ╚══════════════════════════════════════════════════════════════════════════════════════╝