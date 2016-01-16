/* global Meteor */
/* global ReactiveTable */
/* global ConceptMate */
/* global BackupCollections */
/* global Mongo */

ConceptMate = typeof ConceptMate !== 'undefined' ? ConceptMate : {};
ConceptMate.Collections = typeof ConceptMate.Collections !== 'undefined' ? ConceptMate.Collections : {};

BackupCollections = new Mongo.Collection('cm_backup-collections');

ConceptMate.Collections.BackupCollections = BackupCollections;

if (Meteor.isClient) {
  Meteor.subscribe('cm_backup-collections');
}

if (Meteor.isServer) {
  Meteor.publish('cm_backup-collections', function () {
    
    if (!ConceptMate.BackupConfig.allowed.call(this)) {
      this.ready();
      return;
    }

    return BackupCollections.find({});
  });

  ReactiveTable.publish('cm_backup-collections', function () {
    
    if (!ConceptMate.BackupConfig.allowed.call(this)) {
      return [];
    }
    
    return ConceptMate.Collections.BackupCollections;
  }, function () {
    return {
      // group: Meteor.userDomain(this.userId)
    };
  });
}