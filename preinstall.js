const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname,'bin'),(err, files) => {
    files.filter(file => file.indexOf('manga-') === 0 || file === 'manga')
        .map(file => path.join(__dirname,'bin',file))
        .forEach(file => {
            fs.chmod(file,0755,(err)=>{
                if (err) throw err;
            });
        })
});
