const fs = require('fs');
const base64Img = require('base64-img');
const Clarify = require('clarifai');

var args = process.argv.slice(2);

const imageFolder = './' + args + '/';
const paths = [];

const app = new Clarifai.App({
 apiKey: 'a72bc3de0c69476fb72270189e03518e'
});

if(args){
  fs.readdirSync(imageFolder).forEach(file => {
    if(file == '.DS_Store'){
      console.log(file + ' ignored');
    } else {
      console.log("Reading of " + imageFolder + file + " was successfull!");
      paths.push(imageFolder + file);
      encodeBase64(file);
    }
  })
} else {
  console.log("Please specify an input directory!");
}

function encodeBase64(file){
  var ext = file.substr(file.lastIndexOf('.') + 1);
  console.log("Encoding " + imageFolder + file + " into BASE64...");
  var data = base64Img.base64Sync(imageFolder + file);
  console.log("Encoding of" + imageFolder + file + " was successfull!");
  var base = data.replace('data:image/' + ext + ';base64,', '');
  console.log("Running prediction model..");
  runPrediction(base);
}

function runPrediction(b){
  app.models.predict(Clarifai.GENERAL_MODEL, {base64: b})
  .then(
    function(response) {
      console.log("CLARIFAI prediction run successfully!");
      createJson(response);
    },
    function(err) {
      console.error(err);
    }
  );
}

function createJson(res){
  console.log("Creating JSON");
  var obj = { table: [] }
  obj.table.push(res);
  var json = JSON.stringify(obj);

  writeToFile(json);
};

function writeToFile(json){
  console.log("Writing JSON to file...");
  fs.appendFile('json.json', json, function (err) {
    if(err) throw err;
    console.log("Response added to json.json");
  });
};
