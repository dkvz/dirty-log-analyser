const fs = require('fs');

function processFile(err, data) {
  if (err) {
    console.log('No file provided as argument, or invalid filename:');
    console.log(err);
    return;
  }
  const dateReg = /^\w{3,4}\s(\d{1,2})\s(\d{2}):/;
  const rates = data.split(data.includes('\r\n') ? '\r\n' : '\n')
  .reduce((acc, l) => {
    const matches = dateReg.exec(l);
    // We got the time of day at index 2.
    // Current day at index 1.
    if (matches && matches.length >= 2) {
      const m1 = matches[1],
        m2 = '_' + matches[2];
      if (!acc[m1]) {
        acc[m1] = [];
      }
      if (acc[m1][m2]) {
        acc[m1][m2]++;
      } else {
        acc[m1][m2] = 1;
      }
    }
    return acc;
  }, {});
  console.log(rates);
}

console.log('Reading from: ' + process.argv[2]);
fs.readFile(process.argv[2], 'utf-8', processFile);
