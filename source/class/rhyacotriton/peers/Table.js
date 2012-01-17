/**
 * The GUI definition of the qooxdoo unit test runner.
 */
qx.Class.define("rhyacotriton.peers.Table",
{
  extend : rhyacotriton.BasicTable,

  /**
   * @lint ignoreUndefined(qxc)
   */
  construct : function(store, torrents)
  {
    var n2c = {
        "id"             : this.tr("Pid"),
        "torrent_id"     : this.tr("Id"),
        "ip"             : this.tr("IP"),
        "port"           : this.tr("Port"),
        "state"          : this.tr("State"),
        "choke_state"    : this.tr("Choking"),
        "interest_state" : this.tr("Intersted"),
        "local_choke"    : this.tr("Is choking?")
    };

    this.base(arguments, n2c);

    var tcm = this.getTableColumnModel();
    var n2p = this.getColumnNameToPositionIndex();

    tcm.setColumnWidth(n2p.id, 70, true);
    tcm.setColumnWidth(n2p.ip, 90, true);
    tcm.setColumnWidth(n2p.port, 50, true);
    tcm.setColumnWidth(n2p.torrent_id, 30, true);
    tcm.setColumnWidth(n2p.state, 60, true);
    tcm.setColumnWidth(n2p.interest_state, 60, true);
    tcm.setColumnWidth(n2p.choke_state, 60, true);
    tcm.setColumnWidth(n2p.local_choke, 40, true);

    tcm.setDataCellRenderer(n2p.local_choke,
        new qx.ui.table.cellrenderer.Boolean());

    [n2p.interest_state
    ,n2p.choke_state
    ,n2p.local_choke
    ].map(function(id) {
        tcm.setColumnVisible(id, false);
    });

    var tm = this.getTableModel();

    /* Set the special order of sorting in the table for composite types 
       of data. */
    tm.setSortMethods(n2p.id, store.buildPidComparator(n2p.id));
    tm.setSortMethods(n2p.ip, store.buildIPComparator(n2p.ip));

    store.addListener("peerDataLoadCompleted", 
        this.getEventHandler("dataLoadCompleted"), this);



    /* Filters */

    var unfilteredView = tm.getView();
    var filteredView = tm.addView(function(row) {
        var tid = row[n2p.torrent_id];
        var sel = torrents.getSelectedIds();
        return (sel.indexOf(tid) != -1);
    }, this);

    torrents.getSelectionModel().addListener("changeSelection", function() {
        console.log("change selection");
        if (torrents.getSelectedIds().length == 0) {
            this.setView(unfilteredView);
        } else {
            if (this.getView() != filteredView)
                this.setView(filteredView);
            this.updateView(filteredView);
        }
    }, tm);
  },

  members: {
  }
});
