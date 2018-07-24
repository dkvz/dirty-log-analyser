const fs = require('fs');

/**
 * Arguments:
 * 2. Log file
 * 3. Day
 * 4. Hour
 * 5. Get the full requests info
 */

function processFile(err, data) {
  if (err) {
    console.log('No file provided as argument, or invalid filename:');
    console.log(err);
    return;
  }
  const dateReg = new RegExp('^\\w{3,4}\\s' + process.argv[3] + '\\s' + process.argv[4] + ':');
  const lines = data.split(data.includes('\r\n') ? '\r\n' : '\n');
  const filtered = [];
  let found = false;
  for (const line of lines) {
    const matches = dateReg.exec(line);
    if (matches) {
      filtered.push(line);
      if (!found) found = true;
    } else {
      if (found) break;
    }
  }
  const requests = filtered.reduce((acc, l) => {
    const vals = l.split(' ');
    if (vals.length < 19) return acc;
    // IP addr + port is at position 5.
    const ip = vals[5].substr(0, vals[5].indexOf(':'));
    const url = vals[18].replace(/"/g, '');
    const backend = vals[7].replace(/~/g, '');
    if (!acc[ip]) acc[ip] = {count: 1, requests: []};
    else acc[ip].count++;
    if (process.argv[5]) {
      let reqSeen = acc[ip].requests.some((e, i, arr) => {
        if (e.url === url) {
          arr[i].count++;
          return true;
        }
      });
      if (!reqSeen) {
        acc[ip].requests.push({
          url: url,
          backend: backend,
          count: 1
        });
      }
    }
    return acc;
  }, {});
  console.log(JSON.stringify(requests, null, 2));
}

fs.readFile(process.argv[2], 'utf-8', processFile);
