function fib(n) {
    let i = 1;
    let f1 = 1;
    let f2 = 1;
    while (i < n) {
        const next = f1 + f2;
        f1 = f2;
        f2 = next;
        i++;
    }
    return f1;
}

console.log(fib(10));