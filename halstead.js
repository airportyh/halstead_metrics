const acorn = require("acorn");
const estraverse = require("estraverse");
const colors = require("colors/safe");

function getSource(node, codeBuffer) {
    return codeBuffer.slice(node.start, node.end).join("");
}

function replaceCode(node, replacement, codeBuffer) {
    codeBuffer[node.start] = replacement;
    for (let i = node.start + 1; i < node.end; i++) {
        codeBuffer[i] = "";
    }
}

exports.halsteadMetrics = function halsteadMetrics(code) {
    const ast = acorn.parse(code);
    const codeBuffer = code.split("");
    let operands = [];
    let operators = [];
    estraverse.traverse(ast, {
        leave: function (node, parent) {
            if (node.type === "Literal") {
                replaceCode(node, colors.green(node.raw), codeBuffer);
                operands.push(node.raw);
            } else if (node.type === "ArrayExpression" || node.type === "ObjectExpression") {
                const source = getSource(node, codeBuffer);
                replaceCode(node, colors.green(source), codeBuffer);
                operands.push(source);
            } else if (node.type === "CallExpression") {
                if (node.callee.type === "MemberExpression") {
                    const property = node.callee.property;
                    replaceCode(property, colors.magenta(property.name), codeBuffer);
                    operators.push(property.name);
                } else if (node.callee.type === "Identifier") {
                    replaceCode(node.callee, colors.magenta(node.callee.name), codeBuffer);
                    operators.push(node.callee.name);
                }
                const source = getSource(node.callee, codeBuffer) + colors.bold(colors.magenta("(")) + 
                    node.arguments.map((arg) => getSource(arg, codeBuffer)).join(", ") + colors.bold(colors.magenta(")"));
                replaceCode(node, source, codeBuffer);
                operators.push("function/method call ()");
            } else if (node.type === "Identifier") {
                replaceCode(node, colors.green(node.name), codeBuffer);
                operands.push(node.name);
            } else if (node.type === "BinaryExpression") {
                const operatorNode = { start: node.left.end + 1, end: node.right.start - 1 };
                replaceCode(operatorNode, colors.magenta(node.operator), codeBuffer);
                operators.push(node.operator);
            } else if (node.type === "LogicalExpression") {
                const operatorNode = { start: node.left.end + 1, end: node.right.start - 1 };
                replaceCode(operatorNode, colors.magenta(node.operator), codeBuffer);
                operators.push(node.operator);
            } else if (node.type === "UnaryExpression") {
                const operatorNode = { start: node.start, end: node.argument.start - 1 };
                replaceCode(operatorNode, colors.magenta(node.operator), codeBuffer);
                operators.push(node.operator);
            } else if (node.type === "MemberExpression") {
                if (node.computed) {
                    const operatorNode = { start: node.object.end, end: node.end };
                    replaceCode(operatorNode, 
                        colors.magenta("[") + getSource(node.property, codeBuffer) + colors.magenta("]"), 
                        codeBuffer);
                    operators.push("indexed access []");
                } else {
                    const operatorNode = { start: node.object.end, end: node.property.start - 1 };
                    replaceCode(operatorNode, colors.underline(colors.magenta(".")), codeBuffer);
                    operators.push(".");
                }
            } else if (node.type === "VariableDeclaration") {
                const keywordNode = { start: node.start, end: node.declarations[0].start - 1 };
                replaceCode(keywordNode, colors.magenta(node.kind), codeBuffer);
                operators.push(node.kind);
            } else if (node.type === "IfStatement") {
                operators.push("if");
                const ifNode = { start: node.start, end: node.start + 2 };
                replaceCode(ifNode, colors.magenta("if"), codeBuffer);
                if (node.alternate) {
                    const elseNode = { start: node.consequent.end + 1, end: node.consequent.end + 5 };
                    replaceCode(elseNode, colors.magenta("else"), codeBuffer);
                    operators.push("else");
                }
            } else if (node.type === "ReturnStatement") {
                operators.push("return");
                const returnNode = { start: node.start, end: node.start + 6 };
                replaceCode(returnNode, colors.magenta("return"), codeBuffer);
            } else if (node.type === "MethodDefinition") {
                if (node.static) {
                    operators.push("static");
                    const staticNode = { start: node.start, end: node.start + 6 };
                    replaceCode(staticNode, colors.magenta("static"), codeBuffer);
                }
                if (node.kind === "constructor") {
                    operators.push("constructor");
                } else {
                    operators.push(node.key.name);
                }
                replaceCode(node.key, colors.magenta(node.key.name), codeBuffer);
            } else if (node.type === "FunctionDeclaration") {
                operators.push("function");
                operators.push(node.id.name);
                const functionNode = { start: node.start, end: node.start + 8 };
                replaceCode(functionNode, colors.magenta("function"), codeBuffer);
                replaceCode(node.id, colors.magenta(node.id.name), codeBuffer);
            } else if (node.type === "FunctionExpression") {
                operators.push("function");
                const functionNode = { start: node.start, end: node.start + 8 };
                const source = getSource(node, codeBuffer);
                if (source.startsWith("function")) {
                    replaceCode(functionNode, colors.magenta("function"), codeBuffer);
                }
            } else if (node.type === "UpdateExpression") {
                operators.push(node.operator);
                const opNode = { end: node.end, start: node.end - 2 };
                replaceCode(opNode, colors.magenta(node.operator), codeBuffer);
            } else if (node.type === "WhileStatement") {
                operators.push("while");
                const whileNode = { start: node.start, end: node.start + 5 };
                replaceCode(whileNode, colors.magenta("while"), codeBuffer);
            } else if (node.type === "AssignmentExpression") {
                operators.push("=");
                const eqNode = { start: node.left.end + 1, end: node.right.start - 1 };
                replaceCode(eqNode, colors.magenta("="), codeBuffer);
            } else if (node.type === "ForStatement") {
                operators.push("for");
                const forNode = { start: node.start, end: node.start + 3 };
                replaceCode(forNode, colors.magenta("for"), codeBuffer);
            } else if (node.type === "ForInStatement") {
                operators.push("for in");
                const forNode = { start: node.start, end: node.start + 3 };
                replaceCode(forNode, colors.magenta("for"), codeBuffer);
                const inNode = { start: node.left.end + 1, end: node.right.start - 1 };
                replaceCode(inNode, colors.magenta("in"), codeBuffer);
            } else if (node.type === "ClassDeclaration") {
                operators.push("class");
                const classNode = { start: node.start, end: node.start + 5 };
                replaceCode(classNode, colors.magenta("class"), codeBuffer);
            } else if (node.type === "ThisExpression") {
                operands.push("this");
                replaceCode(node, colors.green("this"), codeBuffer);
            } else if (node.type === "NewExpression") {
                operands.push("new");
                const newNode = { start: node.start, end: node.start + 3 };
                replaceCode(newNode, colors.magenta("new"), codeBuffer);
            }
        }
    });
    const rewrittenCode = colors.gray(codeBuffer.join(""));
    const distinctOperators = new Set(operators);
    const distinctOperands = new Set(operands.filter(x => !distinctOperators.has(x)));
    const vocabulary = distinctOperators.size + distinctOperands.size;
    const length = operands.length + operators.length;
    const estimatedLength = distinctOperators.size * Math.log2(distinctOperators.size) + 
        distinctOperands.size * Math.log2(distinctOperands.size);
    const loc = code.split("\n").length;
    const volume = length * Math.log2(vocabulary);
    const operandRepetitiveness = (operands.length / distinctOperands.size);
    const difficulty = (distinctOperators.size / 2) * operandRepetitiveness;
    const effort = difficulty * volume;
    return {
        coloredCode: rewrittenCode,
        distinctOperators,
        distinctOperands,
        operators,
        operands,
        vocabulary,
        length,
        estimatedLength,
        loc,
        volume,
        difficulty,
        effort
    };
}