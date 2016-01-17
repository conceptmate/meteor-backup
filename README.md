# Meteor Collection Backup

Most systems in production allow for some sort of data backup. Meteor, however, does not
yet provide data backup of collections besides MongoDB's native export/import calls.

`$ meteor add conceptmate:backup`

This package does an initial stab to offer data export and import within Meteor. One
advantage of this package over native MongoDB calls is its independence of the underlying
database.

The backup package offers logic and UI to export data from Mongo.Collection and FS.Collection.
Each collection is exported into its JSON file. All JSON files are then zipped into a
single file, which can be downloaded from the server. FS.File data from FS.Collection
is stored in binary format in subfolders named as collection name and stored along
with JSON files in the zip archive.

Exported zip files can be uploaded to the server and imported afterwards. Before data is
imported into a collection, all existing data will be removed beforehand.

This package is not yet feature complete but it works in its core functionality. I will
be busy with other projects over the next few weeks and not be able to do incremental
changes. Therefore, I am searching for help of other Meteor geeks like me :).

**Will create a working example if enough interest.** [See issue #1 and +1 ;)](https://github.com/conceptmate/meteor-backup/issues/1)

**Feedback Welcome.** Please create an issue.

## Set Up Collections for Export

To add a collection to a backup it needs to be added to ConceptMate.Collections.BackupCollections.
A Meteor method is provided.

```javascript
Meteor.call('addBackupCollection', collectionName);
```

Collections can be removed from a backup by calling the following Meteor function.

```javascript
Meteor.call('deleteBackupCollection', backupCollectionId);
```

All set backup collections will be exported when the following function is called
on the server. An archive with all collection data is then stored in the FS.Collection
accessible through ConceptMate.Collections.Backups.

```javascript
ConceptMate.Backup.exportAllCollections();
```

## Blaze UI Templates

This package also provides Blaze UI components hiding some of the complexity behind
a 'simpler' UI. In the following, screenshots of an app and sample code is provided.

### Backups List (client-side)

The `cmBackup_BackupList` template displays a table of all existing and ongoing exports.
Each row in the table is a backup. Backups can be downloaded by clicking on the arrow
down icon. A backup can be imported by clicking on the arrow up icon. The trash can icon
deletes a backup.

A backup can be triggered by clicking on the `Start Backup` button. To upload a backup
click on the `Choose File` button and choose a backup file from the file system. A file
is uploaded immediately!

![Screenshot Backups](/images/backups.png "Backups Screenshot")

An example on how to embed the `cmBackup_BackupList` as follows.

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
    FlowRouter.go('backup.collections');
  }
});
```

### Backup Collections List (client-side)

The backup collection table shows all collections that will be exported when an backup
is triggered. The order defines the order in which collections are exported, starting
with the lowest number.

![Screenshot Backup Collections](/images/backup-collections.png "Backup Collections Screenshot")

An example on how to embed the `cmBackup_BackupCollectionList` as follows.

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

This package also deals with rights managements, although at a very basic level. By
default all backups and backup collections are published to clients. In order to publish
that data only to users with specific roles, e.g., use alanning:roles package.

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
```

Further, read and write access should be restricted in a production system.

```javascript
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

# Improvements

This code was written as part of a bigger project and extracted later into its
own package. Therefore, it might not be feature complete and not bug free. Please
file an issue or submit a PR and contribute to this project.

# License
This software is released under MIT license. Copyright is held by ConceptMate and refers to the author of this package, namely Roman Rädle.

The MIT License (MIT)

Copyright (c) 2016 ConceptMate

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
