/* global Buffer */
/* global check */

Meteor.methods({
  
  /**
   * 
   */
  deleteBackup: function (backupId) {
    console.log('delete backup %o', backupId);
    check(backupId, String);

    Backups.remove({ _id: backupId });
  }
});