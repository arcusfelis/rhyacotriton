/**
 * The GUI definition of the qooxdoo unit test runner.
 */
qx.Class.define("rhyacotriton.Table",
{
  extend : rhyacotriton.BasicTable,

  /**
   * @lint ignoreUndefined(qxc)
   */
  construct : function(store)
  {
    var n2c = {
        "id"       : "Id",
        "name"     : "Name",
        "total"    : "Total",
        "left"     : "Left",
        "progress" : "Progress",
        "rating"   : "Rating",
        "online"   : "On-line",
        "seeders"  : "Ss",
        "leechers" : "Ls",
        "state"    : "State",
        "downloaded" : "In Now",
        "uploaded" : "Out Now",
        "all_time_downloaded" : "In Before",
        "all_time_uploaded"   : "Out Before",
        "sum_downloaded" : "Total In",
        "sum_uploaded"   : "Total Out",
        "speed_in"    : "Speed In",
        "speed_out"   : "Speed Out"
    };

    this.base(arguments, n2c);

    var tcm = this.getTableColumnModel();
    var n2p = this.getColumnNameToPositionIndex();

    tcm.setColumnWidth(n2p.name, 250, true);
    tcm.setColumnWidth(n2p.id, 30, true);
    tcm.setColumnWidth(n2p.progress, 65, true);
    tcm.setColumnWidth(n2p.total, 70, true);
    tcm.setColumnWidth(n2p.left, 70, true);
    tcm.setColumnWidth(n2p.leechers, 40, true);
    tcm.setColumnWidth(n2p.seeders, 40, true);
    tcm.setColumnWidth(n2p.state, 70, true);
    tcm.setColumnWidth(n2p.rating, 60, true);
    tcm.setColumnWidth(n2p.all_time_downloaded, 65, true);
    tcm.setColumnWidth(n2p.all_time_uploaded, 70, true);
    tcm.setColumnWidth(n2p.downloaded, 70, true);
    tcm.setColumnWidth(n2p.uploaded, 70, true);
    tcm.setColumnWidth(n2p.sum_downloaded, 70, true);
    tcm.setColumnWidth(n2p.sum_uploaded, 70, true);
    tcm.setColumnWidth(n2p.speed_in, 70, true);
    tcm.setColumnWidth(n2p.speed_out, 70, true);

    tcm.setDataCellRenderer(n2p.progress,
        new rhyacotriton.cellrenderer.Progress());
    tcm.setDataCellRenderer(n2p.rating,
        new rhyacotriton.cellrenderer.Rating());
    tcm.setDataCellRenderer(this.online,
        new qx.ui.table.cellrenderer.Boolean());
    
    [n2p.total
    ,n2p.left
    ,n2p.downloaded
    ,n2p.uploaded
    ,n2p.all_time_downloaded
    ,n2p.all_time_uploaded
    ,n2p.sum_downloaded
    ,n2p.sum_uploaded
    ].map(function(id) {
        tcm.setDataCellRenderer(id,
            new rhyacotriton.cellrenderer.Size());
    });

    tcm.setDataCellRenderer(n2p.speed_in,
        new rhyacotriton.cellrenderer.Speed());
    tcm.setDataCellRenderer(n2p.speed_out,
        new rhyacotriton.cellrenderer.Speed());

    [n2p.left
    ,n2p.downloaded
    ,n2p.uploaded
    ,n2p.all_time_downloaded
    ,n2p.all_time_uploaded
    ].map(function(id) {
        tcm.setColumnVisible(id, false);
    });


    var s = this.__store = store;
    var e = this.getEventHandler;
    s.addListener("dataAdded", e("dataAdded"), this);
    s.addListener("dataRemoved", e("dataRemoved"), this);
    s.addListener("dataRemoveFailure", e("dataRemoveFailure"), this);
    s.addListener("dataLoadCompleted", e("dataLoadCompleted"), this);
    s.addListener("dataUpdated", e("dataUpdated"), this);
  },

  members: {
    __store : undefined,

    __calcProgress : function(rowData) {
        var n2p = this.getColumnNameToPositionIndex();

        var total      = rowData[n2p.total];
        var left       = rowData[n2p.left];
        var completed  = total - left;

        return ((completed / total) * 100).toFixed(2);
    },

    __calcRating : function(rowData) {
        var n2p = this.getColumnNameToPositionIndex();

        var nowU    = rowData[n2p.uploaded];
        var nowD    = rowData[n2p.downloaded];
        var beforeU = rowData[n2p.all_time_downloaded];
        var beforeD = rowData[n2p.all_time_uploaded];

        var totalD = nowD + beforeD;
        var totalU = nowU + beforeU;
        if (totalD == 0) return 0;
        return (totalU / totalD).toFixed(2);
    },

    __calcSumDownloading : function(rowData) {
        var n2p = this.getColumnNameToPositionIndex();

        var now    = rowData[n2p.downloaded];
        var before = rowData[n2p.all_time_uploaded];

        return now+before;
    },

    __calcSumUploading : function(rowData) {
        var n2p = this.getColumnNameToPositionIndex();

        var now    = rowData[n2p.uploaded];
        var before = rowData[n2p.all_time_downloaded];

        return now+before;
    },


    startSelectedRows: function() 
    {
      this.info("startSelectedRows");
      this.__store.start(this.getSelectedIds());
    },


    stopSelectedRows: function() 
    {
      this.info("stopSelectedRows");
      this.__store.stop(this.getSelectedIds());
    },


    /**
     * Set data from row (map from server) to newValues (row in the table).
     */
    fillFields: function(row, newValues, add) 
    {
      newValues = this.base.fillFields(row, newValues);
      var n2p = this.getColumnNameToPositionIndex();
      
      if (add) {
        newValues[n2p.speed_id] = 0;
        newValues[n2p.speed_out] = 0;
      }
      newValues[n2p.sum_uploaded] = 
        this.__calcSumUploading(newValues);
      newValues[n2p.sum_downloaded] = 
        this.__calcSumDownloading(newValues);
      newValues[n2p.rating] = this.__calcRating(newValues);
      newValues[n2p.progress] = this.__calcProgress(newValues);

      return newValues;
    }
  }
});
