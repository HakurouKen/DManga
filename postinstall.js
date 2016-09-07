const fs = require('fs');
const path = require('path');

function linkToNodeModule(src,dst){
    dst = path.join(__dirname,'node_modules',dst || src);
    src = path.join(__dirname,'dist',src);

    fs.lstat(dst, (err,stat) => {
        if (!stat) {
            fs.symlink(src,dst,'dir',(err)=> {
                if(err) throw err;
            });
        }
    });
}

linkToNodeModule('lib');
linkToNodeModule('crawler');
