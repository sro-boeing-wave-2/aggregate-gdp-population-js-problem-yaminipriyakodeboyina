/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */
const fs = require('fs');

const aggregate = (filePath) => {
  const rawdata = fs.readFileSync('continent.json', 'utf8');
  const raw = JSON.parse(rawdata);
  const arr = JSON.stringify(raw);
  const rep = /{|}|"|\[|\]/gi;
  const str = arr.replace(rep, '');
  const cont1 = str.split(',');
  const continentmap = new Map();
  for (let i = 0; i < cont1.length; i += 1) {
    const cont2 = cont1[i].split(':');
    continentmap.set(cont2[0], cont2[1]);
  }
  const data = fs.readFileSync(filePath, 'utf8');
  const v = /"/gi;
  const data1 = data.replace(v, '');
  const array = data1.split('\n');
  let headers = [];
  headers = array[0].split(',');
  const array1 = [];
  for (let i = 1; i < array.length; i += 1) {
    array1.push(array[i].split(','));
  }
  const coun = [];
  for (let i = 0; i < array1.length - 1; i += 1) {
    coun.push(array1[i][0]);
  }
  const cont = coun.map(x => continentmap.get(x));
  let gdp2012;
  let pop2012;
  for (let i = 0; i < headers.length; i += 1) {
    if (headers[i] === 'GDP Billions (US Dollar) - 2012') {
      gdp2012 = i;
    }
    if (headers[i] === 'Population (Millions) - 2012') {
      pop2012 = i;
    }
  }
  let contset = [];
  contset = Array.from(new Set(cont));
  let index;
  const gdp = new Array(contset.length).fill(0);
  const pop = new Array(contset.length).fill(0);
  for (let i = 0; i < coun.length; i += 1) {
    index = contset.indexOf(cont[i]);
    gdp[index] += parseFloat(array1[i][gdp2012]);
    pop[index] += parseFloat(array1[i][pop2012]);
  }
  const result = {};
  for (let i = 0; i < contset.length - 1; i += 1) {
    result[contset[i]] = {
      GDP_2012: gdp[i],
      POPULATION_2012: pop[i],

    };
  }
  fs.writeFileSync('./output/output.json', JSON.stringify(result));
};

module.exports = aggregate;
