import potrace from 'potrace';
import fs from 'fs';
import config from '../../config/config.js';

export const uploadImgToSvg = (img) => {
  fs.access(config.uploadFolder, (error) => {
    if (error) {
      fs.mkdirSync(config.uploadFolder);
    }
  });
  const { buffer, originalname } = img;
  const filePath = `${config.uploadFolder}${originalname}`;
  potrace.trace(buffer, function (err, svg) {
    if (err) throw err;
    fs.writeFile(filePath, svg, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
};
