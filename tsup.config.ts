import { defineConfig } from 'tsup';
export default defineConfig({
    entry                           : ["lib/lexer.ts"],
    format                          : ["cjs", "esm"],
    dts                             : true,
    splitting                       : false,
    sourcemap                       : true,
    clean                           : true,
});