/* global Npm */
/* global Package */
Package.describe({
  name: 'conceptmate:backup',
  version: '0.1.0',
  // Brief, one-line summary of the package.
  summary: 'A package that offers convenient functions and UI to backup Meteor collections',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/conceptmate/meteor-backup.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  'jszip': '2.5.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('mongo');
  api.use('templating');
  api.use('check');
  api.use('ejson');
  api.use('less');
  api.use('underscore');
  api.use('ecmascript');
  
  api.use('cfs:standard-packages');
  api.use('cfs:gridfs');
  api.use('lai:collection-extensions');
  api.use('alanning:roles');
  api.use('aldeed:collection2');
  api.use('aldeed:simple-schema');
  api.use('cfs:standard-packages');
  api.use('momentjs:moment');
  api.use('aslagle:reactive-table@0.8.23');
  api.use('anti:i18n');
  api.use('planettraining:material-design-icons-font');
  
  api.addFiles([
    'api/lib/utils/fs-utils.js',
    'api/lib/i18n/lang-de.js',
    'api/lib/i18n/lang-en.js',
    'api/lib/collections/backup-collections/01_backup-collections-collection.js',
    'api/lib/collections/backup-collections/02_backup-collections-methods.js',
    'api/lib/collections/backup-collections/03_backup-collections-schema.js',
    'api/lib/collections/backup-collections/04_backup-collections-table.js',
    'api/lib/collections/backups/01_backups-collection.js',
    'api/lib/collections/backups/02_backups-methods.js',
    'api/lib/collections/backups/04_backups-table.js'
  ], ['client', 'server']);
  
  api.addFiles([
    'api/server/backup-config.js',
    'api/server/backup.js',
    'api/server/backups-methods.js'
  ], ['server']);
  
  api.addFiles([
    'api/client/template-helpers.js',
    'api/client/ui/backup-collection-list.html',
    'api/client/ui/backup-collection-list.js',
    'api/client/ui/backup-list.html',
    'api/client/ui/backup-list.js',
    'api/client/ui/backup-list.less',
    'api/client/ui/table/table-cell-delete.html',
    'api/client/ui/table/table-cell-delete.js',
    'api/client/ui/table/table-cell-delete.less',
    'api/client/ui/table/table-cell-import.html',
    'api/client/ui/table/table-cell-import.js',
    'api/client/ui/table/table-cell-import.less',
    'api/client/ui/table/table-cell-download.html',
    'api/client/ui/table/table-cell-download.less',
    'api/client/ui/table/table-cell-file-uploaded.html'
  ], ['client']);
  
  api.export('ConceptMate');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('conceptmate:backup');
  api.addFiles('tests/backup-tests.js');
});
