const express = require('express');
const multer  = require('multer')
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');


/**
 * Parse the environment variables, such as the INFURA keys.
 */
let env;
try {
  env = JSON.parse(fs.readFileSync('ENV.json', 'utf8'));
} catch (err) {
  console.error("ERROR: before running the application you should create the 'ENV.json'.");
  process.exit()
}


const upload = multer({ dest: 'uploads/' })
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static('./static'));

app.listen(env.local_server_port || 3000, function () {
    console.log('Server running on port ', env.local_server_port || 3000);
});


/**
 * This function uploads the image associated to the HNFT on the ipfs gateway 
 * provided by Infura
 */
app.post('/ipfsUploadImage', upload.single('image'), function (req, res, next) {
  let image = req.file;
  if (!image) {
    res.status(400);
    res.send('Please upload a file');
  }

  const formData = new FormData();
  formData.append('file', fs.createReadStream(image.path));

  const config = {
    headers: {
      ...formData.getHeaders(),
      'Authorization': `Basic ${Buffer.from(`${env.infura_apiKey}:${env.infura_authToken}`).toString('base64')}`,
    },
  };
  
  // send the http request to Infura
  res.contentType('application/json');
  axios.post('https://ipfs.infura.io:5001/api/v0/add', formData, config).then((response) => {
    res.end(JSON.stringify(response.data));
  }).catch((error) => {
    console.error(error)
    res.status(400).send('Error uploading file to IPFS: ', error.message);
  })
})

/**
 * This function uploads the JSON metadata file associated to the HNFT on the 
 * ipfs gateway provided by Infura
 */
app.post('/ipfsUploadMetadata', upload.single('image'), function (req, res, next) {

  let metadata = {
    "name": req.body.name,
    "description": req.body.description,
    "image": req.body.image
  }

  const formData = new FormData();
  formData.append('file', JSON.stringify(metadata));

  const config = {
    headers: {
      ...formData.getHeaders(),
      'Authorization': `Basic ${Buffer.from(`${env.infura_apiKey}:${env.infura_authToken}`).toString('base64')}`,
    },
  };
  
  // send the http request to Infura
  res.contentType('application/json');
  axios.post('https://ipfs.infura.io:5001/api/v0/add', formData, config).then((response) => {
    res.end(JSON.stringify(response.data));
  }).catch((error) => {
    console.error(error)
    res.status(400).send('Error uploading file to IPFS: ', error.message);
  })

})
