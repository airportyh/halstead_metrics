const fs = require("fs");
const colors = require("colors/safe");
const { halsteadMetrics } = require("./halstead");

async function main() {
    const filename = process.argv[2];
    if (!filename) {
        console.log("Please provide a file name.");
        return;
    }
    console.log("Processing", filename);
    const code = (await fs.promises.readFile(filename)).toString();
    const {
        coloredCode,
        operands,
        operators,
        distinctOperands,
        distinctOperators,
        vocabulary,
        length,
        estimatedLength,
        loc,
        volume,
        difficulty,
        effort
    } = halsteadMetrics(code);
    console.log(coloredCode);
    console.log("Total operands = " + operands.length);
    console.log(`Distinct operands = ${distinctOperands.size}:\n`, Array.from(distinctOperands).map(o => colors.green(o)).join(", "));
    console.log("Total operators = " + operators.length);
    console.log(`Distinct operators = ${distinctOperators.size}:\n`, Array.from(distinctOperators).map(o => colors.magenta(o)).join(", "));
    console.log("Program vocabulary = " + vocabulary);
    console.log("Program length = " + length);
    console.log("Estimated program length = " + estimatedLength.toFixed(2));
    console.log("LOC = " + loc);
    console.log("Volume = " + volume.toFixed(2));
    console.log("Difficulty = " + difficulty.toFixed(2));
    console.log("Effort = " + effort.toFixed(2));
}

main().catch((err) => console.log(err.stack));