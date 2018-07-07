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
      paths.push(imageFolder + file);
      var data = base64Img.base64Sync(imageFolder + file);
      var base = data.replace('data:image/png;base64,', '');

      app.models.predict(Clarifai.GENERAL_MODEL, {base64: base})
      .then(
        function(response) {
          createJson(response);
        },
        function(err) {
          console.error(err);
        }
      );
    }
  })
}

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

function createJson(res){
  var obj = { table: [] }
  obj.table.push(res);
  var json = JSON.stringify(obj);
  writeToFile(json);
};

function writeToFile(json){
  fs.writeFile('json.json', json, function (err) {
    if(err) throw err;
    console.log("success");
  });
};
