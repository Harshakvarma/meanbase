import path from 'path'
const Decompress = require('decompress');
const zip = require('decompress-unzip');
const formidable = require('formidable');
import feathersErrors from 'feathers-errors'
import fs from 'fs';

export default function(req, res, next) {
  const app = this;

  if(!req.app || !req.app.get('themesPath')) {
    next(new Error('themesPath not found on server'));
  }

  var createdFolderName = '125098dsflkj1324';

  var createdFolderPath = path.join(req.app.get('themesPath'), createdFolderName);
  try {
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
      if(err) {
        console.log("Error parsing theme: ", err);
        return next(new feathersErrors.NotAcceptable('The theme folder must be compressed in the correct format.'));
      }
      if(!files || !files.file) {
        return next(new feathersErrors.NotAcceptable('The theme folder must be compressed.'));
      }

      var tempFilePath = files.file.path;
      var fileName  = files.file.name;
      var contentType   = files.file.type;

      createdFolderName = fileName.substring(fileName.lastIndexOf('/'), fileName.indexOf('.', fileName.lastIndexOf('/')) );

      if(!createdFolderName || !/^[a-zA-Z0-9_-]+$/.test(createdFolderName)) {
        return next(new feathersErrors.NotAcceptable('Theme folder name was invalid: "' + createdFolderName + '". It should only contain letters, numbers, and - or _'));
      }

      createdFolderPath = path.join(req.app.get('themesPath'), createdFolderName);

      var compressType;
      var decompress = new Decompress();
      switch(contentType) {
        case 'application/x-gzip':
          compressType = Decompress.targz;
          break;
        case 'application/zip':
          compressType = Decompress.zip;
          break;
        case 'application/x-tar':
          compressType = Decompress.tar;
          break;
        case 'application/x-bzip2':
          compressType = Decompress.tar;
          break;
        default:
          compressType = null;
      }

      if(!compressType) {
        return next(new feathersErrors.NotAcceptable('Please send a zip, gz, bz2, or tar file type.'));
      }

      try {
        // Query the entry
        var stats = fs.lstatSync(createdFolderPath);
        // Is it a directory?
        if (stats.isDirectory()) {
          console.log('already exists');
          return next(new feathersErrors.NotAcceptable('A theme with that name has already been uploaded. Please choose a different folder name for your theme.'));
        }
      } catch (err) {
        console.log("Checking if theme already exists error", err);
      }

      decompress.src(tempFilePath)
        .dest(createdFolderPath)
        .use(compressType({strip: 1}));

      decompress.run(function (err, files) {
        if (err) {
          console.log("unzipping theme error: ", err);
          return next(new feathersErrors.Unprocessable(err));
        }

        req.feathers.themeUrl = createdFolderName;
        return next();
      });
    });
  } catch(err) {
    return next(err);
  }
}