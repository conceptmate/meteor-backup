/* global BackupCollections */
/* global SimpleSchema */
ConceptMate = typeof ConceptMate !== 'undefined' ? ConceptMate : {};
ConceptMate.Schemas = typeof ConceptMate.Schemas !== 'undefined' ? ConceptMate.Schemas : {};

ConceptMate.Schemas.BackupCollection = new SimpleSchema({
  collectionName: {
    type: String,
    unique: true
  },
  order: {
    type: Number,
    defaultValue: 1
  }
});

BackupCollections.attachSchema(ConceptMate.Schemas.BackupCollection);
