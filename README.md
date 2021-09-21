# EPAM-NodeJS-Training
## Basics. Node.js fundamental theory
Install packages via:
```bash
npm install
```
### Task 1.1
**Task Description**: the program should read a string from the standard input `stdin`,
reverse it and write it to the standard output `stdout`.

**Solution**: to reverse incoming string from `stdin` I'm using `Transform` stream.

**How to launch**: run this command in your terminal
```bash
npm run start:task1
```

### Task 1.2
**Task Description**: 
* the program should read the content of **.csv** file
* convert it to json format using `csvtojson` package
* write content of csv file to a new **.txt** file
* should read from file and write to file line by line
* Read/Write errors should be logged to the console

**Solution**:
* to read from csv file line by line I'm using `subscribe` method
* to remove `Amount` property from the output I'm using `Transform`
stream
* to catch errors I'm listening for `error` event
* result output could be found in `results` directory 

**How to launch**: run this command in your terminal
```bash
npm run start:task2
```
