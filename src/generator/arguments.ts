import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
  .option("source", {
    alias: "s",
    describe: "Specify the source URL (swagger.json)",
    type: "string",
    demandOption: false,
  })
  .option("output", {
    alias: "o",
    describe: "Specify the output directory",
    type: "string",
    demandOption: false,
  })
  .argv;

export default async function getArgument(name: string) {
  const a = argv instanceof Promise ? await argv : argv;
  return a[name] as string | undefined;
}
