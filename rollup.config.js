import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
import ts from "typescript";
import { readFileSync } from "fs";

const outPath = ".build/index";
const sharedConfig = {
	input: "./src/index.ts",
	plugins: [typescript(), typescriptPaths(), json()],
};
const config = [
	{
		...sharedConfig,
		output: {
			file: `${outPath}.esm.js`,
			format: "esm",
			sourcemap: true,
		},
		external: ["axios", "cheerio"],
	},
	{
		...sharedConfig,
		plugins: [commonjs(), resolve(), ...sharedConfig.plugins],
		output: {
			file: `${outPath}.cjs`,
			format: "cjs",
			sourcemap: true,
			inlineDynamicImports: true,
		},
	},
	{
		...sharedConfig,
		output: [{ file: `${outPath}.d.ts`, format: "es" }],
		plugins: [
			sharedConfig.plugins,
			dts({
				compilerOptions: {
					baseUrl: ".",
					paths: ts.readConfigFile(process.cwd() + "/tsconfig.json", (p) =>
						readFileSync(p, "utf8")
					).config.compilerOptions.paths,
				},
			}),
		],
	},
];
export default config;
