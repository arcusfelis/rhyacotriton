
/**
 * The GUI definition of the qooxdoo unit test runner.
 */
qx.Class.define("rhyacotriton.Table",
{
  extend : rhyacotriton.BasicTable,

  construct : function(store)
  {
    var n2c =
    {
      "id"                  : this.tr("Id"),
      "pid"                 : this.tr("Pid"),
      "name"                : this.tr("Torrent Name"),
      "display_name"        : this.tr("Name"),
      "info_hash"           : this.tr("Info Hash"),
      "wanted"              : this.tr("Wanted"),
      "total"               : this.tr("Total"),
      "left"                : this.tr("Left"),
      "progress"            : this.tr("Progress"),
      "rating"              : this.tr("Rating"),
      "online"              : this.tr("On-line"),
      "seeders"             : this.tr("Ss"),
      "leechers"            : this.tr("Ls"),
      "state"               : this.tr("State"),
      "downloaded"          : this.tr("In Now"),
      "uploaded"            : this.tr("Out Now"),
      "all_time_downloaded" : this.tr("In Before"),
      "all_time_uploaded"   : this.tr("Out Before"),
      "sum_downloaded"      : this.tr("Total In"),
      "sum_uploaded"        : this.tr("Total Out"),
      "speed_in"            : this.tr("Speed In"),
      "speed_out"           : this.tr("Speed Out")
    };

    this.base(arguments, n2c);

    var tm = this.getTableModel();
    var tcm = this.getTableColumnModel();
    var n2p = this.getColumnNameToPositionIndex();

    var rb = tcm.getBehavior();

    rb.set(n2p.name,        { width:"1*", minWidth: 250 });
    rb.set(n2p.display_name, { width:"1*", minWidth: 250 });
    rb.set(n2p.info_hash, { width:"1*", minWidth: 250 });
    rb.set(n2p.id,        { width:"1*", minWidth: 30 });
    rb.set(n2p.pid,       { width:"1*", minWidth: 70 });
    rb.set(n2p.progress,  { width:"1*", minWidth: 65 });
    rb.set(n2p.total,     { width:"1*", minWidth: 70 });
    rb.set(n2p.wanted,    { width:"1*", minWidth: 70 });
    rb.set(n2p.left,      { width:"1*", minWidth: 70 });
    rb.set(n2p.leechers,  { width:"1*", minWidth: 40 });
    rb.set(n2p.seeders,   { width:"1*", minWidth: 40 });
    rb.set(n2p.state,     { width:"1*", minWidth: 70 });
    rb.set(n2p.rating,    { width:"1*", minWidth: 60 });
    rb.set(n2p.downloaded,{ width:"1*", minWidth: 70 });
    rb.set(n2p.uploaded,  { width:"1*", minWidth: 70 });
    rb.set(n2p.speed_in,  { width:"1*", minWidth: 70 });
    rb.set(n2p.speed_out, { width:"1*", minWidth: 70 });
    rb.set(n2p.all_time_downloaded, { width:"1*", minWidth: 65 });
    rb.set(n2p.all_time_uploaded,   { width:"1*", minWidth: 70 });
    rb.set(n2p.sum_downloaded,      { width:"1*", minWidth: 70 });
    rb.set(n2p.sum_uploaded,        { width:"1*", minWidth: 70 });
    rb.set(n2p.online,    { width:"1*", minWidth: 30 });

    tcm.setDataCellRenderer(n2p.progress, 
      new rhyacotriton.cellrenderer.Progress());
    tcm.setDataCellRenderer(n2p.rating, new rhyacotriton.cellrenderer.Rating());
    tcm.setDataCellRenderer(n2p.online, new qx.ui.table.cellrenderer.Boolean());

    [ n2p.left
    , n2p.wanted
    , n2p.downloaded
    , n2p.uploaded
    , n2p.all_time_downloaded
    , n2p.all_time_uploaded
    , n2p.sum_downloaded
    , n2p.sum_uploaded ].map(function(id) {
      tcm.setDataCellRenderer(id, new rhyacotriton.cellrenderer.Size());
    });

    tcm.setDataCellRenderer(n2p.speed_in, new rhyacotriton.cellrenderer.Speed());
    tcm.setDataCellRenderer(n2p.speed_out, new rhyacotriton.cellrenderer.Speed());

    // Hide columns
    [ n2p.name
    , n2p.info_hash
    , n2p.left
    , n2p.total
    , n2p.online
    , n2p.downloaded
    , n2p.uploaded
    , n2p.all_time_downloaded
    , n2p.all_time_uploaded ].map(function(id)
    {
      tcm.setColumnVisible(id, false);
    });

    tm.setSortMethods(n2p.pid, store.buildPidComparator(n2p.pid));

    var s = this.__store = store;
    s.addListener("dataAdded", 
      this.getEventHandler("dataAdded"), this);
    s.addListener("dataRemoved", 
      this.getEventHandler("dataRemoved"), this);
    s.addListener("dataRemoveFailure", 
      this.getEventHandler("dataRemoveFailure"), this);
    s.addListener("dataLoadCompleted", 
      this.getEventHandler("dataLoadCompleted"), this);
    s.addListener("dataUpdated", 
      this.getEventHandler("dataUpdated"), this);
    s.addListener("logEvent", this.logHandler, this);
  },

  members :
  {
    __store : undefined,


    /**
     * TODOC
     *
     * @param rowData {var} TODOC
     * @return {var} TODOC
     */
    __calcProgress : function(rowData)
    {
      var n2p = this.getColumnNameToPositionIndex();

      var wanted = rowData[n2p.wanted];
      var left = rowData[n2p.left];
      var completed = wanted - left;

      return (completed / wanted);
    },


    /**
     * TODOC
     *
     * @param rowData {var} TODOC
     * @return {int | var} TODOC
     */
    __calcRating : function(rowData)
    {
      var n2p = this.getColumnNameToPositionIndex();

      var nowU = rowData[n2p.uploaded];
      var nowD = rowData[n2p.downloaded];
      var beforeU = rowData[n2p.all_time_uploaded];
      var beforeD = rowData[n2p.all_time_downloaded];

      var totalD = nowD + beforeD;
      var totalU = nowU + beforeU;
      if (totalD == 0) return 0;
      return (totalU / totalD).toFixed(2);
    },


    /**
     * TODOC
     *
     * @param rowData {var} TODOC
     * @return {var} TODOC
     */
    __calcSumDownloading : function(rowData)
    {
      var n2p = this.getColumnNameToPositionIndex();

      var now = rowData[n2p.downloaded];
      var before = rowData[n2p.all_time_downloaded];

      return now + before;
    },


    /**
     * TODOC
     *
     * @param rowData {var} TODOC
     * @return {var} TODOC
     */
    __calcSumUploading : function(rowData)
    {
      var n2p = this.getColumnNameToPositionIndex();

      var now = rowData[n2p.uploaded];
      var before = rowData[n2p.all_time_uploaded];

      return now + before;
    },


    /**
     * TODOC
     *
     */
    startSelectedRows : function()
    {
      this.info("startSelectedRows");
      this.__store.start(this.getSelectedIds());
    },


    /**
     * TODOC
     *
     */
    stopSelectedRows : function()
    {
      this.info("stopSelectedRows");
      this.__store.stop(this.getSelectedIds());
    },


    /**
     * Set data from row (map from server) to newValues (row in the table).
     *
     * @param row {var} TODOC
     * @param newValues {var} TODOC
     * @param add {var} TODOC
     * @return {var} TODOC
     */
    fillFields : function(row, newValues, add)
    {
      newValues = this.base(arguments, row, newValues, add);
      var n2p = this.getColumnNameToPositionIndex();

      if (add)
      {
        newValues[n2p.speed_in] = 0;
        newValues[n2p.speed_out] = 0;
      }

      newValues[n2p.sum_uploaded] = this.__calcSumUploading(newValues);
      newValues[n2p.sum_downloaded] = this.__calcSumDownloading(newValues);
      newValues[n2p.rating] = this.__calcRating(newValues);
      newValues[n2p.progress] = this.__calcProgress(newValues);

      return newValues;
    },

    /**
     * Handles updates from the store.
     */
    logHandler: function(e)
    {
      var data = e.getData();
      var name = data.name;
      if (name == "started_torrent") {
        this.setTorrentOnline(data.torrent_id, true);
      } 
      else 
      if (name == "stopped_torrent") {
        this.setTorrentOnline(data.torrent_id, false);
      }
    },

    setTorrentOnline: function(torrentId, isOnline) 
    {
      this.particallyUpdateRows([{"id" : torrentId, "online" : isOnline}]);
    }
  }
});
