/**
 * Aggregates GDP and Population Data by Continents
 * @param {*} filePath
 */
const aggregate = filePath => {
  const fs = require('fs');
  let rawdata = fs.readFileSync('continent.json', 'utf8');
  let raw = JSON.parse(rawdata);
  let arr = JSON.stringify(raw);
  let rep = /{|}|"|\[|\]/gi;
  let str = arr.replace(rep, "");
  let cont1 = str.split(",");
  let cont2 = [];
  continentmap = new Map();
  for (let i = 0; i < cont1.length; i++) {
    const cont2 = cont1[i].split(':');
    continentmap.set(cont2[0], cont2[1]);
  }
  let data = fs.readFileSync('data/datafile.csv', 'utf8')
  let r = JSON.stringify(data);
  let v = /\"/gi;
  let data1 = data.replace(v, '');
  let array = data1.split('\n');
  let headers = [];
  headers = array[0].split(",");
  let array1 = [];
  for (let i = 1; i < array.length; i++) {
    array1.push(array[i].split(","));
  }
  let coun = [];
  for (let i = 0; i < array1.length - 1; i++) {
    coun[i] = array1[i][0];
  }
  let cont = coun.map(x => continentmap.get(x));
  let x, gdp2012, pop2012;
  for (let i = 0; i < headers.length; i++) {
    if (headers[i] == "GDP Billions (US Dollar) - 2012") {
      gdp2012 = i;
    }
    if (headers[i] == "Population (Millions) - 2012") {
      pop2012 = i;
    }
  }
  let contset = [];
  contset = Array.from(new Set(cont));
  let index;
  let gdp = new Array(contset.length).fill(0);
  let pop = new Array(contset.length).fill(0);
  for (let i = 0; i < coun.length; i++) {
    index = contset.indexOf(cont[i]);
    gdp[index] = gdp[index] + parseFloat(array1[i][gdp2012]);
    pop[index] = pop[index] + parseFloat(array1[i][pop2012]);


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
