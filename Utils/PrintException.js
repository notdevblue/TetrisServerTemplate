const { writeFile } = require("fs");

const date = new Date();

module.exports = {
    PrintException(exception, debugDataMessage) {
        let result = `\r\n---------- ${exception} ----------\r\nDATA:`;

        debugDataMessage.forEach(e => {
            result = result.concat("\r\n\t", e);
        });
        result = result.concat("\r\n", "---------- END OF EXCEPTION ----------\r\n");

        console.log(result);

        writeFile(`./Logs/exception_${date.toDateString()}_${date.getMilliseconds()}.log`, result, err => {
            if (err) throw err;
        });
    }
}

