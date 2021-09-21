import csv from 'csvtojson';
import { existsSync, mkdirSync } from 'fs';
import { createReadStream, createWriteStream } from 'fs';
import { Transform, pipeline } from "stream";
import { StringDecoder } from 'string_decoder';

if (!existsSync('./results')) {
    mkdirSync('./results');
}

const csvFilePath='./csv/source.csv';
const writable1 = createWriteStream('./results/result1.txt');
const writable2 = createWriteStream('./results/result2.txt');

const formatOutput = new Transform({
    transform(chunk, encoding, callback) {
        if (encoding === 'buffer') {
            const decoder = new StringDecoder('utf-8');
            chunk = decoder.write(chunk);
        }

        chunk = JSON.parse(chunk);

        const formattedChunk = Object.fromEntries(
            Object.entries(chunk)
                .filter(([key, val]) => key !== 'Amount')
                .map(([key, val]) => [key.toLowerCase(), val])
        );

        callback(null, `${JSON.stringify(formattedChunk)}\n`);
    }
});

/**
 * @desc transform stream is used to get rid of 'Amount' property in output file
 */
csv()
    .fromFile(csvFilePath)
    .subscribe((json,lineNumber)=>{
        return new Promise((resolve) => {
            resolve();
        })
    })
    .pipe(formatOutput)
    .pipe(writable1)
    .on('error', err => console.log(`Something went wrong! Error: ${err.message}`))

/**
 * @desc with pipeline() method
 */
pipeline(
    createReadStream(csvFilePath),
    csv(),
    formatOutput,
    writable2,
    (err) => {
        if (err) {
            console.error('Pipeline failed.', err);
        }
    },
);
