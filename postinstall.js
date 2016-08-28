const fs = require('fs');
const path = require('path');
const src = path.join(__dirname,'dist/lib');
const dst = path.join(__dirname,'node_modules/lib');

fs.lstat(dst, (err,stat) => {
    if (!stat) {
        fs.symlink(src,dst,'dir',(err)=> {
            if(err) throw err;
        });
    }
});
