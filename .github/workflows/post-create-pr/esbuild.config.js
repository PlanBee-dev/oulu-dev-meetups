const { build } = require("esbuild");

/** @type {import('esbuild/lib/main').BuildOptions} */
const options = {
	entryPoints: ["./src/index.ts"],
	bundle: true,
	platform: "node",
	outdir: "lib",
	outbase: "src",
};

build(options).catch((err) => {
	process.stderr.write(err.stderr);
	process.exit(1);
});
