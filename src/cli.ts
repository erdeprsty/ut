#!/usr/bin/env node
import { program } from "commander";
import { CLIError } from "./helpers/errors";

program.name("ut-cli");
program.version("0.0.0", "-v, --version");

program.option("--serve", "start the UT REST API Server");
program.option("-p, --port <number>", "specify the port to serve on", "3000");

program.parse();

const options = program.opts();

if (options.serve) {
	throw new CLIError("Not implemented yet!");
}
