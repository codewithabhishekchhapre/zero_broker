const fileFilter = (req, file, cb) => {
     const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
     const videoTypes = ['video/mp4', 'video/quicktime']; // quicktime = .mov
   
     if (imageTypes.includes(file.mimetype) || videoTypes.includes(file.mimetype)) {
       cb(null, true);
     } else {
       cb(new Error('Invalid file format. Only images (jpg, png) and videos (mp4, mov) allowed'), false);
     }
   };
   
   module.exports = fileFilter;
   