/* global check */
/* global moment */
/* global Meteor */
/* global Export */
/* global global */

var fs = Npm.require('fs');
var JSZip = Npm.require('jszip');

var importRunning = false;

/**
 * 
 */
var insertDocToCollection = function (collection, doc, options) {
  try {
    return collection.insert(doc, options);
  }
  catch (err) {
    console.error(err);
  }
};

/**
 * 
 */
var clearCollection = function (collection) {
  collection.remove({});
};

Meteor.methods({
  
  /**
   * 
   */
  exportCollection: function (collectionName) {
    return Backup.exportCollection(collectionName);
  },
  
  /**
   * 
   */
  importCollection: function (collectionName, data) {
    Backup.importCollection(collectionName, data);
  },
  
  /**
   * 
   */
  importBackup: function (backupId) {
    check(backupId, String);
    
    console.log('should import data', !importRunning);
    
    if (importRunning) {
      return false;
    }
    
    console.log('import data', importRunning);

    importRunning = true;
    
    // unblock current long running task
    this.unblock();
      
    // wrap functions in fiber/meteor environment
    let insertDocToCollectionInFiber = Meteor.bindEnvironment(insertDocToCollection);
    let clearCollectionInFiber = Meteor.bindEnvironment(clearCollection);
      
    // make async function sync
    let getBufferSync = Meteor.wrapAsync(ConceptMate.FSUtils.getBuffer);

    // get backup data
    let backup = Backups.findOne({ _id: backupId });
      
    // get archive buffer
    let archiveBlob = getBufferSync(backup);

    var archive = new JSZip();
    archive.load(archiveBlob);

    // get all data files
    let dataFiles = archive.file(/\.json/);

    // iterate over all json data files
    _.each(dataFiles, (dataFile) => {

      // get data file content
      let content = dataFile.asText();

      // parse data file
      let entries = EJSON.parse(content);

      // get collection          
      let collection = Backup.getCollection(entries.collectionName);
      
      if (!collection) {
        console.warn('No collection named ' + entries.collectionName + ' found. Ignoring export.');
        return true;
      }
          
      // get folder for FS.Collection in case this collection contains files
      let filesFolder;
      if (entries.collectionType === 'FS.Collection') {
        filesFolder = archive.folder(entries.collectionName);
      }

      if (entries.collectionName !== 'Meteor.users') {
        // clear all data in collection
        clearCollectionInFiber(collection);
      }

      let timeoutCounter = 0;

      _.each(entries.data, (entry) => {
        try {
      
          if (entry.type === 'FS.File') {

            setTimeout(() => {

              let newFile = new FS.File();
              newFile._id = entry._id;
              newFile.owner = entry.owner;
              newFile.original = entry.original;
              newFile.metadata = entry.metadata;

              let archiveFile = filesFolder.file(entry.fileName);
              let blob = archiveFile.asUint8Array();
          
              if (!entry.fileType) {
                console.warn('file type is missing ignore entry', entry);
                return true;
              }
          
              // // Attach the ReadStream data to it. You must tell it what the content type is.
              newFile.attachData(blob, { type: entry.fileType }, function (err) {

                if (err) {
                  throw err;
                }

                newFile.name(entry.fileName);

                try {
                  insertDocToCollectionInFiber(collection, newFile, (err, fileObj) => {
                    
                    if (fileObj) {
                      // console.log('inserted id fs.file', fileObj._id);
                    }
                  });
                }
                catch (err) {
                  // empty
                  console.error(err);
                }
              });
            }, 1000 * ++timeoutCounter);
            return true;
          }
              
          let objId = insertDocToCollectionInFiber(collection, entry, { validate: false });
          // console.log('inserted id doc', objId);
        }
        catch (err) {
          // empty
        }
      });
    });
    
    importRunning = false;
    
    return true;
  },
  
  /**
   * 
   */
  exportAllCollections: function () {

    let backupCollections = BackupCollections.find({}, {
      sort: {
        order: 1
      }
    });
    
    // export zip archive    
    var archive = new JSZip();

    backupCollections.forEach(function (backup) {
      let collectionName = backup.collectionName;
      Backup.exportCollection(archive, collectionName);
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
  }
});