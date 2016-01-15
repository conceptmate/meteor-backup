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
      return Roles.userIsInRole(userId, ConceptMate.BackupConfig.allowedRoles);
    },
    update: function(userId, doc, fieldNames, modifier) {
      return Roles.userIsInRole(userId, ConceptMate.BackupConfig.allowedRoles);
    },
    remove: function(userId, doc) {
      return Roles.userIsInRole(userId, ConceptMate.BackupConfig.allowedRoles);
    },
    download: function (userId) {
      return Roles.userIsInRole(userId, ConceptMate.BackupConfig.allowedRoles);
    }
  });
  
  Meteor.publish('cm_backups', function() {
    if (!Roles.userIsInRole(this.userId, ConceptMate.BackupConfig.allowedRoles)) {
      this.ready();
      return;
    }
    
    return Backups.find({});
  });
  
  ReactiveTable.publish('cm_backups', function () {
    
    if (!Roles.userIsInRole(this.userId, ConceptMate.BackupConfig.allowedRoles)) {
      return [];
    }
    
    return ConceptMate.Collections.Backups;
  }, function () {
    return {
      // group: Meteor.userDomain(this.userId)
    };
  });
}
