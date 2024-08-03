const path = require('path')
const fs = require('fs')

const clearpath = filepath => {

    const uploadpath = path.join(__dirname, '..', '..', 'assets', 'Product_image')
       console.log(uploadpath)
    const oldImagePath = path.join(uploadpath,filepath);
        console.log(oldImagePath)

    if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
    }
};


exports.clearpath = clearpath