/* global Buffer */
/* global BackupCollections */
/* global global */
/* global _ */
/* global EJSON */
/* global Backup */

// FS.debug = true;

ConceptMate = typeof ConceptMate !== 'undefined' ? ConceptMate : {};

Backup = (function () {
  
  var JSZip = Npm.require('jszip');
  
  /**
   * 
   */
  var constructor = function () {

  };
  
  /**
   * 
   */
  this.getCollection = function (collectionName) {
    let host = Meteor.isClient ? window : global;

    let names = collectionName.split('.');

    let collection = host;

    try {
      _.each(names, function (name) {
        collection = collection[name];
      });
    }
    catch (err) {
      return null;
    }

    return collection !== host ? collection : null;
  };

  /**
   * 
   */
  this.exportCollection = function (archive, collectionName) {
    console.log('Exporting collection ' + collectionName + '...');

    let collection = this.getCollection(collectionName);

    if (!collection) {
      console.warn('No collection named ' + collectionName + ' found. Ignoring export.');
      return;
    }

    let entries = {
      collectionName: collectionName,
      collectionType: 'Mongo.Collection',
      data: []
    };

    // create a folder for files of FS.Collection
    let filesFolder;
    if (collection instanceof FS.Collection) {
      filesFolder = archive.folder(collectionName);
      entries.collectionType = 'FS.Collection';
    }

    let cursor = collection.find();
    cursor.forEach(function (entry) {

      if (entry instanceof FS.File) {

        try {
          // get file name, add _id in case two files have the same filename          
          let fileName = entry.name() + '_' + entry._id + '.' + entry.extension();

          let cleanEntry = {
            _id: entry._id,
            fileName: fileName,
            type: 'FS.File',
            fileType: entry.original.type,
            owner: entry.owner,
            original: entry.original,
            metadata: entry.metadata
          };

          let blob = getBufferSync(entry);

          filesFolder.file(fileName, blob, { base64: true });

          entry = cleanEntry;
        }
        catch (err) {
          // empty
          return true;
        }
      }

      entries.data.push(entry);
    });

    console.log('Export ' + collectionName + ' finished');

    archive.file(collectionName + '.json', EJSON.stringify(entries, {
      indent: true,
      canonical: true
    }));
  };
  
  /**
   * 
   */
  this.exportAllCollections = function() {
    let backupCollections = BackupCollections.find({}, {
      sort: {
        order: 1
      }
    });
    
    // export zip archive    
    var archive = new JSZip();

    backupCollections.forEach((backup) => {
      let collectionName = backup.collectionName;
      this.exportCollection(archive, collectionName);
    });

    let blob = archive.generate({ type: 'uint8array' });
    
    // Create the FS.File instance
    var newFile = new FS.File();

    // // Attach the ReadStream data to it. You must tell it what the content type is.
    newFile.attachData(blob, { type: 'application/zip' }, function (err) {

      if (err) {
        throw err;
      }

      let date = moment().format('DD-MM-YYYY_hh-mm-ss');

      newFile.name(date + '.zip');

      Backups.insert(newFile);
    });
  };
  
  /**
   * 
   */
  var getBufferAsync = function (doc, callback) {

    var buffer = new Buffer(0);
    // callback has the form function (err, res) {}
    var readStream = doc.createReadStream();

    readStream.on('data', function (chunk) {
      buffer = Buffer.concat([buffer, chunk]);
    });
    readStream.on('error', function (err) {
      callback(err, null);
    });
    readStream.on('end', function () {
      callback(null, buffer);
    });
  };
  
  /**
   * 
   */
  var getBufferSync = Meteor.wrapAsync(getBufferAsync);

  constructor.call(this);

  return this;
}).call({});

ConceptMate.Backup = Backup;