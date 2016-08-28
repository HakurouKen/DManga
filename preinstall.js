const fs = require('fs');
const path = require('path');

fs.chmod(path.join(__dirname,'bin/app'),0755,(err)=>{
    if (err) throw err;
});
