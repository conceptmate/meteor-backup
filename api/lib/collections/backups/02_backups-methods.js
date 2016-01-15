/* global Buffer */
/* global check */

Meteor.methods({
  
  /**
   * 
   */
  deleteBackup: function (backupId) {
    check(backupId, String);

    Backups.remove({ _id: backupId });
  }
});