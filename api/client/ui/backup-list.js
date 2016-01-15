Template.cmBackup_BackupList.events({
  
  /**
   * 
   */
  'click .create-backup': function(e, tmpl) {
    Meteor.call('exportAllCollections', function(err, res) {
      if (err) {
        console.error(err);
      }
      else {
        console.log(res);
      }
    });
  },
  
  'change .upload-backup': function(e, tmpl) {
    FS.Utility.eachFile(e, function(file) {
      Backups.insert(file, function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
      });
    });
  }
});