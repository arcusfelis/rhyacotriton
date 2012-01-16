/**
 * The GUI definition of the qooxdoo unit test runner.
 */
qx.Class.define("rhyacotriton.peers.Table",
{
  extend : rhyacotriton.BasicTable,

  /**
   * @lint ignoreUndefined(qxc)
   */
  construct : function(store)
  {
    var n2c = {
        "id"         : this.tr("Pid"),
        "torrent_id" : this.tr("Id"),
        "ip"         : this.tr("IP"),
        "port"       : this.tr("Port"),
        "state"      : this.tr("State")
    };

    this.base(arguments, n2c);

    var tcm = this.getTableColumnModel();
    var n2p = this.getColumnNameToPositionIndex();

    tcm.setColumnWidth(n2p.id, 50, true);
    tcm.setColumnWidth(n2p.ip, 60, true);
    tcm.setColumnWidth(n2p.port, 50, true);
    tcm.setColumnWidth(n2p.torrent_id, 30, true);
    tcm.setColumnWidth(n2p.state, 60, true);
  },

  members: {
  }
});
