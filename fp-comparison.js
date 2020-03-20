const fs = require("fs");
const path = require("path");
const { halsteadMetrics } = require("./halstead");

async function main() {
    const entries = await fs.promises.readdir("./fp-examples");
    const columns = [
        "File",
        "Distinct Operators",
        "Distinct Operands",
        "Total Operators",
        "Total Operands",
        "Vocabulary",
        "Length",
        "Estimated Length",
        "LoC",
        "Volume",
        "Difficulty",
        "Effort"
    ];
    console.log(columns.join("\t"));
    for (let entry of entries) {
        const filepath = path.join("fp-examples", entry);
        if (path.extname(filepath) === ".js") {
            const code = (await fs.promises.readFile(filepath)).toString();
            const {
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
            console.log([
                entry,
                distinctOperators.size,
                distinctOperands.size,
                operators.length,
                operands.length,
                vocabulary,
                length,
                estimatedLength,
                loc,
                volume,
                difficulty,
                effort
            ].join("\t"));
        }
    }
}

main().catch((err) => console.log(err.stack));