import { parseArgs } from "util";

export type Args = {
  dictionary: string;
  port: number;
  solver: string;
};

export default async function parse(): Promise<Args> {
  let { values } = parseArgs({
    options: {
      dictionary: {
        type: "string",
        short: "d",
      },
      port: {
        type: "string",
        short: "p",
      },
      solver: {
        type: "string",
        short: "s",
      },
    },
  });
  return {
    dictionary: await checkPath(values.dictionary, "dictionary"),
    port: parseInt(values.port || "27974") || 27974,
    solver: await checkPath(values.solver, "solver"),
  };
}

async function checkPath(path: string | undefined, what: string): Promise<string> {
  if (path) {
    if (await Bun.file(path).exists()) return path;
    console.error("Invalid path specified for", what);
    process.exit(1);
  } else {
    console.error("Path is not specified for", what);
    process.exit(1);
  }
}
