Template.cmBackup_TableCellImport.events({
  
  'click .cm_backup-import-table-cell': function(e, tmpl) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    let cell = Template.parentData(1);
    // let data = Template.parentData(4);
    
    // let title = i18nf('app.modalDialog.title');
    // let message = i18nf('app.modalDialog.message');
    // if (data.settings) {
    //   let settings = data.settings;
    //   let i18nPrefix = settings.i18nPrefix;
      
    //   if (typeof i18nPrefix === 'function') {
    //     i18nPrefix = i18nPrefix();
    //   }
    //   title = i18npf(i18nPrefix, 'itemDelete.title');
    //   message = i18npf(i18nPrefix, 'itemDelete.message');
    // }
    
    // let context = {
    //   title: title,
    //   message: message
    // };
    
    // App.showModal(context, () => {
    //  if (typeof cell.cellEvent === 'function') {
        cell.cellEvent.call(this, e, tmpl);
    //   } 
    // });
  }
});