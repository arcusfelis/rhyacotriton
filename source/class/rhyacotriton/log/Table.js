
/**
 * The GUI definition of the qooxdoo unit test runner.
 */
qx.Class.define("rhyacotriton.log.Table",
{
  extend : rhyacotriton.BasicTable,


  /**
   * @lint ignoreUndefined(qxc)
   */
  construct : function(store, torrents)
  {
    var n2c =
    {
      "torrent_id" : this.tr("Id"),
      "time"       : this.tr("Time"),
      "name"       : this.tr("Name"),
      "message"    : this.tr("Information")
    };

    this.base(arguments, n2c);

    var tcm = this.getTableColumnModel();
    var n2p = this.getColumnNameToPositionIndex();

    var rb = tcm.getBehavior();

    rb.set(n2p.torrent_id, { width:"1*", minWidth: 30 });
    rb.set(n2p.time,       { width:"1*", minWidth: 55 });
    rb.set(n2p.name,       { width:"1*", minWidth: 90 });
    rb.set(n2p.message,    { width:"1*", minWidth: 130 });

    var tm = this.getTableModel();
    var timeRenderer = new qx.ui.table.cellrenderer.Date();
    var format = new qx.util.format.DateFormat("HH:mm:ss");
    timeRenderer.setDateFormat(format);
    tcm.setDataCellRenderer(n2p.time, timeRenderer);

    store.addListener("logEvent", function(e)
    {
      var data = e.getData();
      data.time = new Date();
      this.addRows([ data ]);
    },
    this);

    this.initFilters(torrents);
  },

  members : {}
});
