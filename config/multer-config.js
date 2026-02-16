const multer=require('multer');

const storage=multer.memoryStorage();   ///// for memoryStorage ----> use image(or file) type Buffer not string(in model)
const upload=multer({storage:storage});

module.exports=upload;