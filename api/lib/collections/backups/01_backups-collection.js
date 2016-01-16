/* global Meteor */
/* global FS */
/* global ConceptMate */
/* global Backups */
/* global Mongo */

ConceptMate = typeof ConceptMate !== 'undefined' ? ConceptMate : {};
ConceptMate.Collections = typeof ConceptMate.Collections !== 'undefined' ? ConceptMate.Collections : {};

var backupsStore = new FS.Store.GridFS('cm_backups');

Backups = new FS.Collection('cm_backups', {
  stores: [backupsStore],
});
ConceptMate.Collections.Backups = Backups;

if (Meteor.isClient) {
  Meteor.subscribe('cm_backups');
}

if (Meteor.isServer) {
  
  Backups.allow({
    insert: function (userId, doc) {
      return true;
    },
    update: function(userId, doc, fieldNames, modifier) {
      return true;
    },
    remove: function(userId, doc) {
      return true;
    },
    download: function (userId) {
      return true;
    }  
  });
  
  Meteor.publish('cm_backups', function() {
    
    if (!ConceptMate.BackupConfig.allowed.call(this)) {
      this.ready();
      return;
    }
    
    return Backups.find({});
  });
  
  ReactiveTable.publish('cm_backups', function () {
    
    console.log('echo1');
    
    if (!ConceptMate.BackupConfig.allowed.call(this)) {
      return [];
    }
    
    console.log('echo2');
    console.log(Backups instanceof FS.Collection);
    // console.log(Backups);
    
    return Backups;
  }, function () {
    return {
      // group: Meteor.userDomain(this.userId)
    };
  });
}
