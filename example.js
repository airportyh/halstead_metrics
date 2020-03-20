const { halsteadMetrics } = require("./halstead");

const code = `
function fib(n) {
    if (n === 1) {
        return 1;
    } else if (n === 2) {
        return 1;
    } else {
        return fib(n - 1) + fib(n - 2);
    }
}

console.log(fib(10));
`;

const metrics = halsteadMetrics(code);
console.log(metrics);