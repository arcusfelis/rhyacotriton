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
    var n2c = {
        "torrent_id"     : this.tr("Id"),
        "time"           : this.tr("Time"),
        "name"           : this.tr("Name"),
        "message"        : this.tr("Information")
    };

    this.base(arguments, n2c);

    var tcm = this.getTableColumnModel();
    var n2p = this.getColumnNameToPositionIndex();

    tcm.setColumnWidth(n2p.torrent_id, 30, true);
    tcm.setColumnWidth(n2p.time, 55, true);
    tcm.setColumnWidth(n2p.name, 90, true);
    tcm.setColumnWidth(n2p.message, 130, true);


    var tm = this.getTableModel();
    var timeRenderer = new qx.ui.table.cellrenderer.Date();
    var format = new qx.util.format.DateFormat("HH:mm:ss");
    timeRenderer.setDateFormat(format);
    tcm.setDataCellRenderer(n2p.time, timeRenderer);
    

    store.addListener("logEvent", 
        function(e) {
            var data = e.getData();
            data.time = new Date();
            this.addRows([data]);
        }, this);



    this.initFilters(torrents);
  },

  members: {
  }
});
