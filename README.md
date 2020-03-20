# Halstead Metrics

This repo is an exploration of Halstead Software Metrics written in JavaScript.
`halstead.js` contains a function `halsteadMetrics(code)` which will return
a metrics object give a piece of JavaScript code.

## Example

```
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
```

Output:

```
{
  coloredCode: '\u001b[90m\u001b[39m\n' +
    '\u001b[90m\u001b[35mfunction\u001b[90m \u001b[35mfib\u001b[90m(\u001b[32mn\u001b[90m) {\u001b[39m\n' +
    '\u001b[90m    \u001b[35mif\u001b[90m (\u001b[32mn\u001b[90m \u001b[35m===\u001b[90m \u001b[32m1\u001b[90m) {\u001b[39m\n' +
    '\u001b[90m        \u001b[35mreturn\u001b[90m \u001b[32m1\u001b[90m;\u001b[39m\n' +
    '\u001b[90m    } \u001b[35melse\u001b[90m \u001b[35mif\u001b[90m (\u001b[32mn\u001b[90m \u001b[35m===\u001b[90m \u001b[32m2\u001b[90m) {\u001b[39m\n' +
    '\u001b[90m        \u001b[35mreturn\u001b[90m \u001b[32m1\u001b[90m;\u001b[39m\n' +
    '\u001b[90m    } \u001b[35melse\u001b[90m {\u001b[39m\n' +
    '\u001b[90m        \u001b[35mreturn\u001b[90m \u001b[35mfib\u001b[90m\u001b[1m\u001b[35m(\u001b[90m\u001b[22m\u001b[32mn\u001b[90m \u001b[35m-\u001b[90m \u001b[32m1\u001b[90m\u001b[1m\u001b[35m)\u001b[90m\u001b[22m \u001b[35m+\u001b[90m \u001b[35mfib\u001b[90m\u001b[1m\u001b[35m(\u001b[90m\u001b[22m\u001b[32mn\u001b[90m \u001b[35m-\u001b[90m \u001b[32m2\u001b[90m\u001b[1m\u001b[35m)\u001b[90m\u001b[22m;\u001b[39m\n' +
    '\u001b[90m    }\u001b[39m\n' +
    '\u001b[90m}\u001b[39m\n' +
    '\n' +
    '\u001b[90m\u001b[32mconsole\u001b[90m\u001b[4m\u001b[35m.\u001b[90m\u001b[24m\u001b[35mlog\u001b[90m\u001b[1m\u001b[35m(\u001b[90m\u001b[22m\u001b[35mfib\u001b[90m\u001b[1m\u001b[35m(\u001b[90m\u001b[22m\u001b[32m10\u001b[90m\u001b[1m\u001b[35m)\u001b[90m\u001b[22m\u001b[1m\u001b[35m)\u001b[90m\u001b[22m;\u001b[39m\n' +
    '\u001b[90m\u001b[39m',
  distinctOperators: Set {
    '===',
    'return',
    '-',
    'fib',
    'function/method call ()',
    '+',
    'if',
    'else',
    'function',
    '.',
    'log'
  },
  distinctOperands: Set { 'n', '1', '2', 'console', '10' },
  operators: [
    '===',
    'return',
    '===',
    'return',
    '-',
    'fib',
    'function/method call ()',
    '-',
    'fib',
    'function/method call ()',
    '+',
    'return',
    'if',
    'else',
    'if',
    'else',
    'function',
    'fib',
    '.',
    'fib',
    'function/method call ()',
    'log',
    'function/method call ()'
  ],
  operands: [
    'fib', 'n',   'n',
    '1',   '1',   'n',
    '2',   '1',   'fib',
    'n',   '1',   'fib',
    'n',   '2',   'console',
    'log', 'fib', '10'
  ],
  vocabulary: 16,
  length: 41,
  estimatedLength: 49.66338827944708,
  loc: 13,
  volume: 164,
  difficulty: 19.8,
  effort: 3247.2000000000003
}
```

The `coloredCode` can be printed out to the console to see a color-coded representation
of the analyzed code. As for what the other properties means, I will refer you to
the [Wikipedia article](https://en.wikipedia.org/wiki/Halstead_complexity_measures).

## FP Examples

I used the metrics to analyze [11 functional programming code examples](http://tobyho.com/2015/11/09/functional-programming-by-example/).

Here is the [analysis](https://docs.google.com/spreadsheets/d/17IbvvJm75LKgimNsgvRlbKLDVi_m82WVjMDKuZO5kfs/edit?usp=sharing) I did on Google Spreadsheets. The results are inconclusive.
