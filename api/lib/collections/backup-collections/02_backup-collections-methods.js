/* global check */
Meteor.methods({
  
  /**
   * 
   */
  addBackupCollection: function(collectionName) {
    check(collectionName, String);
    
    BackupCollections.insert({
      collectionName: collectionName,
      order: 1
    });
  },
  
  /**
   * 
   */
  deleteBackupCollection: function(backupCollectionId) {
    console.log('delete backup collection %o', backupCollectionId);

    check(backupCollectionId, String);
    
    BackupCollections.remove({ _id: backupCollectionId });
  }
});