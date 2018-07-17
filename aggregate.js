/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */
const fs = require('fs');

const aggregate = (filePath) => {
  const p1 = new Promise((resolve, reject) => {
    fs.readFile('continent.json', 'utf8', (err, rawdata) => {
      if (err) reject(err);
      const raw = JSON.parse(rawdata);
      resolve(raw);
    });
  });
  const p2 = new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      const v = /"/gi;
      const data1 = data.replace(v, '');
      resolve(data1);
    });
  });
  Promise.all([p1, p2]).then((values) => {
    const data = values[1];
    const mapper = values[0];
    let headers = [];
    const data1 = data.split('\n');
    headers = data1[0].split(',');
    const result = {};
    const countryindex = headers.indexOf('Country Name');
    const gdp2012index = headers.indexOf('GDP Billions (US Dollar) - 2012');
    const pop2012index = headers.indexOf('Population (Millions) - 2012');

    data1.forEach((dataline) => {
      const array = dataline.split(',');
      if (mapper[array[countryindex]] !== undefined) {
        if (result[mapper[array[countryindex]]] === undefined) {
          result[mapper[array[countryindex]]] = {};
          result[mapper[array[countryindex]]].GDP_2012 = parseFloat(array[gdp2012index]);
          result[mapper[array[countryindex]]].POPULATION_2012 = parseFloat(array[pop2012index]);
        } else {
          result[mapper[array[countryindex]]].GDP_2012 += parseFloat(array[gdp2012index]);
          result[mapper[array[countryindex]]].POPULATION_2012 += parseFloat(array[pop2012index]);
        }
      }
    });
    fs.writeFile('./output/output.json', JSON.stringify(result), (err) => {
      if (err) throw err;
    });
  });
};
module.exports = aggregate;
