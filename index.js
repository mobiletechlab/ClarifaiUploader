const fs = require('fs');
const base64Img = require('base64-img');
const async = require('async');
require('clarifai');

const args = process.argv.slice(2);
const imageFolder = './' + args + '/';
const predictions = [];

const app = new Clarifai.App({
    apiKey: 'a72bc3de0c69476fb72270189e03518e'
});

if (args.length > 0) {

    let outputFileStream = fs.createWriteStream(`${imageFolder}${args}.json`, { flags: 'a' });

    const imageFileNames = fs.readdirSync(imageFolder)
        .filter(((fileName) => !/.DS_Store|.json/.test(fileName)));

    async.each(imageFileNames, (fileName, cb) => {

        var data = base64Img.base64Sync(imageFolder + fileName);
        var base = data.replace('data:image/png;base64,', '');

        app.models.predict(Clarifai.GENERAL_MODEL, { base64: base })
            .then(
                function (response) {
                    let output_data = response.outputs[0].data;
                    output_data['image']['filename'] = fileName;
                    predictions.push(output_data);
                    cb();
                },
                function (err) {
                    console.error(err);
                    cb();
                }
            );

    }, (fin) => {
        if (fin) {
            throw Error(fin);
        }

        try {
            outputFileStream.write(JSON.stringify(predictions), 'utf8');
            console.log('Done');
        } catch (ex) {
            console.error('File Stream error', ex);
        }
        outputFileStream.end();
    });
} else {
    console.log('Specify a folder name as first argument.')
}