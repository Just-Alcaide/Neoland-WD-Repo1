import fs from 'fs';
import { read } from './read.js';

export function create(file, data, callback) {
  console.log('create', file, data)
  if (!fs.existsSync(file)) {
    fs.appendFile(file, '[]', function (err) {
      if (err) {
        console.log('create', err);
        return;
      }
    })
  }
  insertData(file, data, callback);
}

async function insertData(file, data, callback) {
  console.log('insertData', data, file);
  let parsedData = []
  await read(file, (readData) => {
    parsedData = [...readData];
    console.log('insertData parsedData', parsedData);

    const processedData = convertStringToBoolean(data);
    
    parsedData.push(processedData);
    // parsedData.push(data);

    fs.writeFile(file, JSON.stringify(parsedData), function (err) {
      if (err) {
        console.log('insertData', err);
        return;
      }
      if (callback) {

        callback(processedData);
        // callback(data);
      }
    })
  });
}

function convertStringToBoolean(data) {
  const convertedData = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === 'true') {
      convertedData[key] = true;
    } else if (value === 'false') {
      convertedData[key] = false;
    } else {
      convertedData[key] = value;
    }
  }
  return convertedData
}