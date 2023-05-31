const express = require('express');

const app = express();

app.use('/', express.static('./static'));

app.listen(process.env.PORT || 3000, function () {
    console.log('Server running on port ', process.env.PORT || 3000);
});
