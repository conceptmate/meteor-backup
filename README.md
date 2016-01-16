# Meteor Collection Backup

Meteor does not provide functions to backup (export/import) collections. Currently,
the only way to export and import data is to use MongoDB's native export/import calls.

This package offers logic and UI to export data from Mongo.Collection and FS.Collection.
All data is zipped into a single file, which can be downloaded from the server.
Exported zip files can also be uploaded to the server and imported afterwards.

All collection data is exported into JSON files. FS.File data from FS.Collection is
further stored in a subfolder named as collection name and stored in the zip archive
along with JSON data.

## Set Up Collections for Export

## Blaze UI Templates

### Backups List (client-side)

```html
<template name="BackupList">
  <div class="backup-list">
    {{#if Template.subscriptionsReady}}
      <div class="card">
        <div class="cc-button" action="open-backup-collection">
          {{i18n 'backup.collection.list'}}
        </div>
      
        {{> cmBackup_BackupList}}
      </div>
    {{else}}
      {{> DefaultLoading}}
    {{/if}}
  </div>
</template>
```

```javascript
Template.BackupList.events({
  
  /**
   * 
   */
  'click *[action="open-backup-collection"]': function(e, tmpl) {
    console.log('echo');
    FlowRouter.go('backup.collections');
  }
});
```

### Backup Collections List (client-side)

```html
<template name="BackupCollectionList">
  <div class="backup-collection-list">
    {{#if Template.subscriptionsReady}}
      <div class="card">
        <div class="cc-button" action="add-backup-collection">
          {{i18n 'backup.collection.add'}}
        </div>
      
        {{> cmBackup_BackupCollectionList}}
      </div>
    {{else}}
      {{> DefaultLoading}}
    {{/if}}
  </div>
</template>
```

```javascript
Template.BackupCollectionList.events({
  
  /**
   * 
   */
  'click *[action="add-backup-collection"]': function(e, tmpl) {
    FlowRouter.go('backup.collection.add');
  },
  
  /**
   *
   */
  'click .reactive-table tbody > tr': function(e, tmpl) {
    let backupCollectionId = this._id;
    
    FlowRouter.go('backup.collection.edit', {
      backupCollectionId: backupCollectionId
    });
  }
});
```

### Backup Collection Edit (client-side)

```html
<template name="BackupCollectionEdit">
  <div class="backup-collection-edit">
    {{#if Template.subscriptionsReady}}
      <div class="card">
        {{#with backupCollection}}
          {{> quickForm collection="ConceptMate.Collections.BackupCollections" id="backup-collection-form" buttonContent=(i18n 'apply') type=insertOrUpdate doc=this}}
        {{/with}}
      </div>
    {{else}}
      {{> DefaultLoading}}
    {{/if}}
  </div>
</template>
```

```javascript
/* global AutoForm */
/* global Template */
Template.BackupCollectionEdit.onCreated(function() {
  this.autorun(() => {
    let backupCollectionId = FlowRouter.getParam('backupCollectionId');
    
    if (backupCollectionId) {
      this.subscribe('backup-collection', backupCollectionId);  
    }
  });
});

Template.BackupCollectionEdit.helpers({
  
  insertOrUpdate: function() {
    return !this._id ? 'insert' : 'update';
  },
  
  /**
   * 
   */
  backupCollection: function() {
    let backupCollectionId = FlowRouter.getParam('backupCollectionId');
    return ConceptMate.Collections.BackupCollections.findOne({ _id: backupCollectionId }) || {};
  }
});

/**
 *
 */
Template.BackupCollectionEdit.events({

  /**
   *
   */
  'submit': function (e, tmpl) {
    e.preventDefault();

    if (AutoForm.validateForm("backup-collection-form")) {
      FlowRouter.go('backup.collections');
    }
  },
});
```

## Rights Management

```javascript
ConceptMate = typeof ConceptMate !== 'undefined' ? ConceptMate : {};

/**
 * Only users with super-admin role can subscribe to ConceptMate.Collections.Backups
 * and ConceptMate.Collections.BackupCollections data. 
 */
ConceptMate.BackupConfig = {
  allowed: function() {
    return Roles.userIsInRole(this.userId, ['super-admin'], Roles.GLOBAL_GROUP);
  }
}; 

if (Meteor.isServer) {
  ConceptMate.Collections.Backups.allow({
    insert: function (userId, doc) {
      return Roles.userIsInRole(userId, ['super-admin']);
    },
    update: function (userId, doc, fields, modifier) {
      return Roles.userIsInRole(userId, ['super-admin']);
    },
    remove: function (userId, doc) {
      return Roles.userIsInRole(userId, ['super-admin']);
    }
  });
  
  ConceptMate.Collections.BackupCollections.allow({
    insert: function (userId, doc) {
      return Roles.userIsInRole(userId, ['super-admin']);
    },
    update: function (userId, doc, fields, modifier) {
      return Roles.userIsInRole(userId, ['super-admin']);
    },
    remove: function (userId, doc) {
      return Roles.userIsInRole(userId, ['super-admin']);
    }
  });
}
```