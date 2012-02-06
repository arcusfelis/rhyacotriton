
/**
 * Contains information from Matroska file.
 */
qx.Class.define("rhyacotriton.tracks.Table",
{
  extend : rhyacotriton.BasicTable,


  /**
   * @lint ignoreUndefined(qxc)
   */
  construct : function(store)
  {
    var n2c =
    {
      "number"     : this.tr("Num"),
      "name"       : this.tr("Name"),
      "type"       : this.tr("Type"),
      "codec"      : this.tr("Codec"),
      "language"   : this.tr("Language")
    };

    this.base(arguments, n2c);

    var tcm = this.getTableColumnModel();
    var n2p = this.getColumnNameToPositionIndex();

    var rb = tcm.getBehavior();

    rb.set(n2p.number,     { width:"1*", minWidth: 30, maxWidth: 40 });
    rb.set(n2p.language,   { width:"1*", minWidth: 55, maxWidth: 70 });
    rb.set(n2p.type,       { width:"1*", minWidth: 55, maxWidth: 70 });
    rb.set(n2p.name,       { width:"1*", minWidth: 90, maxWidth: 120 });

    var tm = this.getTableModel();

    store.addListener("tracksDataLoadCompleted", 
      this.getEventHandler("dataLoadCompleted"), this);
  },

  members : {}
});
