/* global Template */
/* global i18n */
/* global Tables */
Tables = typeof Tables !== 'undefined' ? Tables : {};

if (Meteor.isClient) {
  Meteor.startup(function () {
    Tables.Backups = {
      i18nPrefix: 'backups.table',
      collection: ConceptMate.Collections.Backups.find(),//'cm_backups',
      rowsPerPage: 10,
      showFilter: true,
      showNavigation: 'auto',
      useFontAwesome: false,
      // showColumnToggles: true,
      fields: [
        {
          key: 'download',
          // sortable: false,
          label: "",
          tmpl: Template.cmBackup_TableCellDownload
        },
        {
          key: 'import',
          // sortable: false,
          label: "",
          cellClass: function (value, obj) {
            return this.key + ' align-right';
          },
          tmpl: Template.cmBackup_TableCellImport,
          cellEvent: function(e, tmpl) {
            e.preventDefault();
            e.stopImmediatePropagation();
            
            console.log('started backup import');
            Meteor.call('importBackup', this._id, function(err, res) {
              if (err) {
                console.error(err);
              }
              else {
                console.log(res);
              }
            });
          }
        },
        {
          key: 'name',
          // sortable: true,
          label: function() {
            return i18n('backup.name');
          }
        },
        {
          key: 'type',
          // sortable: true,
          label: function() {
            return i18n('backup.type');
          }
        },
        {
          key: 'size',
          // sortable: true,
          label: function() {
            return i18n('backup.size');
          }
        },
        {
          key: 'extension',
          // sortable: true,
          label: function() {
            return i18n('backup.extension');
          }
        },
        {
          key: 'uploaded',
          label: function() {
            return i18n('backup.fileUploaded');
          },
          tmpl: Template.cmBackup_TableCellFileUploaded
        },
        {
          key: 'delete',
          // sortable: false,
          label: "",
          cellClass: function (value, obj) {
            return this.key + ' align-right';
          },
          tmpl: Template.cmBackup_TableCellDelete,
          cellEvent: function(e, tmpl) {
            Meteor.call('deleteBackup', this._id);
          }
        }
      ],
      group: 'backups'
    };
  });
}