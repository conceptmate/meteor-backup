/* global Concept */
/* global Tables */
ConceptMate = typeof ConceptMate !== 'undefined' ? ConceptMate : {};
ConceptMate.Tables = typeof ConceptMate.Tables !== 'undefined' ? ConceptMate.Tables : {};

if (Meteor.isClient) {
  Meteor.startup(function () {
    ConceptMate.Tables.BackupCollections = {
      i18nPrefix: 'backup-collections.table',
      collection: ConceptMate.Collections.BackupCollections.find(), //'cm_backup-collections',
      rowsPerPage: 10,
      showFilter: true,
      showNavigation: 'auto',
      useFontAwesome: false,
      // showColumnToggles: true,
      fields: [
        {
          key: 'edit',
          sortable: false,
          label: ""
        },
        {
          key: 'collectionName',
          label: 'collection name',
          sortDirection: 'ascending'
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
            Meteor.call('deleteBackupCollection', this._id);
          }
        }
      ],
      group: 'backup-collections'
    };
  });
}