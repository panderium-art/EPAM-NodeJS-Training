import { Transform } from 'stream';

const reverseString = str => str.split("").reverse().join("");

const reverseStrTransform = new Transform({
    transform(chunk, encoding, callback) {
        const string = chunk.toString().trim();
        const reversedString = reverseString(string);
        callback(null, `${reversedString}\n\n`);
    }
})

console.log('Enter a string:');

process.stdin
    .pipe(reverseStrTransform)
    .pipe(process.stdout);

