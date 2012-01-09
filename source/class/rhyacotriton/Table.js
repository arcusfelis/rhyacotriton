/**
 * The GUI definition of the qooxdoo unit test runner.
 */
qx.Class.define("rhyacotriton.Table",
{
  extend : qx.ui.table.Table,

  /**
   * @lint ignoreUndefined(qxc)
   */
  construct : function(store)
  {
    this.__store = store;
    var table = this;

    // table model
    this.__tableModel = new smart.model.Default;
    this.__columnsNameToCaption = {
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
    },

    this.__columnNums = [];
    this.__columnNames = [];
    this.__columnCaptions = [];

    var i = 0;
    for (var name in this.__columnsNameToCaption) {
        var caption = this.__columnsNameToCaption[name];
        this.__columnNums[name] = i;
        this.__columnNames[i] = name;
        this.__columnCaptions[i] = caption;
        i++;
    }
    delete i;

    console.dir(this.__columnCaptions);
    console.dir(this.__columnNames);
    this.__tableModel.setColumns(
        this.__columnCaptions,
        this.__columnNames);


    // Install tableModel
    this.base(arguments, this.__tableModel);

    this.__tableColumnModel = this.getTableColumnModel();

    this.__indexColumnId = 
        this.__tableModel.getColumnIndexById("id");
    this.__nameColumnId = 
        this.__tableModel.getColumnIndexById("name");
    this.__onlineColumnId = 
        this.__tableModel.getColumnIndexById("online");
    this.__leftColumnId = 
        this.__tableModel.getColumnIndexById("left");
    this.__totalColumnId = 
        this.__tableModel.getColumnIndexById("total");
    this.__progressColumnId = 
        this.__tableModel.getColumnIndexById("progress");
    this.__leechersColumnId = 
        this.__tableModel.getColumnIndexById("leechers");
    this.__seedersColumnId = 
        this.__tableModel.getColumnIndexById("seeders");
    this.__downloadedColumnId = 
        this.__tableModel.getColumnIndexById("downloaded");
    this.__uploadedColumnId = 
        this.__tableModel.getColumnIndexById("uploaded");
    this.__sumDownloadedColumnId = 
        this.__tableModel.getColumnIndexById("sum_downloaded");
    this.__sumUploadedColumnId = 
        this.__tableModel.getColumnIndexById("sum_uploaded");
    this.__beforeDownloadedColumnId = 
        this.__tableModel.getColumnIndexById("all_time_downloaded");
    this.__beforeUploadedColumnId = 
        this.__tableModel.getColumnIndexById("all_time_uploaded");
    this.__ratingColumnId = 
        this.__tableModel.getColumnIndexById("rating");
    this.__stateColumnId = 
        this.__tableModel.getColumnIndexById("state");
    this.__speedInColumnId = 
        this.__tableModel.getColumnIndexById("speed_in");
    this.__speedOutColumnId = 
        this.__tableModel.getColumnIndexById("speed_out");



    this.__tableColumnModel.setColumnWidth(this.__nameColumnId, 250, true);
    this.__tableColumnModel.setColumnWidth(this.__indexColumnId, 30, true);
    this.__tableColumnModel.setColumnWidth(this.__progressColumnId, 65, true);
    this.__tableColumnModel.setColumnWidth(this.__totalColumnId, 70, true);
    this.__tableColumnModel.setColumnWidth(this.__leftColumnId, 70, true);
    this.__tableColumnModel.setColumnWidth(this.__leechersColumnId, 40, true);
    this.__tableColumnModel.setColumnWidth(this.__seedersColumnId, 40, true);
    this.__tableColumnModel.setColumnWidth(this.__stateColumnId, 70, true);
    this.__tableColumnModel.setColumnWidth(this.__ratingColumnId, 60, true);
    this.__tableColumnModel.setColumnWidth(this.__beforeDownloadedColumnId, 
        65, true);
    this.__tableColumnModel.setColumnWidth(this.__beforeUploadedColumnId, 70, true);
    this.__tableColumnModel.setColumnWidth(this.__downloadedColumnId, 70, true);
    this.__tableColumnModel.setColumnWidth(this.__uploadedColumnId, 70, true);
    this.__tableColumnModel.setColumnWidth(this.__sumDownloadedColumnId, 70, true);
    this.__tableColumnModel.setColumnWidth(this.__sumUploadedColumnId, 70, true);
    this.__tableColumnModel.setColumnWidth(this.__speedInColumnId, 70, true);
    this.__tableColumnModel.setColumnWidth(this.__speedOutColumnId, 70, true);

    this.__tableColumnModel.setDataCellRenderer(this.__progressColumnId,
        new rhyacotriton.cellrenderer.Progress());
    this.__tableColumnModel.setDataCellRenderer(this.__ratingColumnId,
        new rhyacotriton.cellrenderer.Rating());
    this.__tableColumnModel.setDataCellRenderer(this.__onlineColumnId,
        new qx.ui.table.cellrenderer.Boolean());
    
    [this.__totalColumnId
    ,this.__leftColumnId
    ,this.__downloadedColumnId
    ,this.__uploadedColumnId
    ,this.__beforeDownloadedColumnId
    ,this.__beforeUploadedColumnId
    ,this.__sumDownloadedColumnId
    ,this.__sumUploadedColumnId
    ].map(function(id) {
        table.__tableColumnModel.setDataCellRenderer(id,
            new rhyacotriton.cellrenderer.Size());
    });

    table.__tableColumnModel.setDataCellRenderer(this.__speedInColumnId,
        new rhyacotriton.cellrenderer.Speed());
    table.__tableColumnModel.setDataCellRenderer(this.__speedOutColumnId,
        new rhyacotriton.cellrenderer.Speed());

    [this.__leftColumnId
    ,this.__downloadedColumnId
    ,this.__uploadedColumnId
    ,this.__beforeDownloadedColumnId
    ,this.__beforeUploadedColumnId
    ,this.__onlineColumnId
    ].map(function(id) {
        table.__tableColumnModel.setColumnVisible(id, false);
    });

    // Get SelectionModel
    this.__selectionModel = this.getSelectionModel();
    this.__selectionModel.setSelectionMode(
      qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION
    );

    // Add the index to SmartTableModel
    this.__tableModel.indexedSelection(this.__indexColumnId, 
                                       this.__selectionModel);
    this.__tableModel.addIndex(this.__indexColumnId);

    this.__store.addListener("dataAdded", 
        this.__onDataAdded, this);
    this.__store.addListener("dataRemoved", 
        this.__onDataRemoved, this);
    this.__store.addListener("dataRemoveFailure", 
            this.__onDataRemoveFailure, this);
    this.__store.addListener("dataLoadCompleted", 
            this.__onDataLoadCompleted, this);
    this.__store.addListener("dataUpdated", 
            this.__onDataUpdated, this);
  },

  members: {
    __store: null,

    __indexColumnId: null,
    __nameColumnId: null,
    __onlineColumnId: null,
    __leftColumnId: null,
    __totalColumnId: null,
    __progressColumnId: null,
    __leechersColumnId: null,
    __seedersColumnId: null,
    __stateColumnId: null,
    __ratingColumnId: null,
    __beforeDownloadedColumnId: null,
    __beforeUploadedColumnId: null,
    __downloadedColumnId: null,
    __uploadedColumnId: null,
    __sumDownloadedColumnId: null,
    __sumUploadedColumnId: null,
    __speedInColumnId: null,
    __speedOutColumnId: null,

    __tableModel : null,
    __tableColumnModel : null,
    __selectionModel : null,

    __calcProgress : function(rowData) {
        var total      = rowData[this.__totalColumnId];
        var left       = rowData[this.__leftColumnId];
        var completed  = total - left;

        return ((completed / total) * 100).toFixed(2);
    },

    __calcRating : function(rowData) {
        var nowU    = rowData[this.__uploadedColumnId];
        var nowD    = rowData[this.__downloadedColumnId];
        var beforeU = rowData[this.__beforeUploadedColumnId];
        var beforeD = rowData[this.__beforeDownloadedColumnId];

        var totalD = nowD + beforeD;
        var totalU = nowU + beforeU;
        if (totalD == 0) return 0;
        return (totalU / totalD).toFixed(2);
    },

    __calcSumDownloading : function(rowData) {
        var now    = rowData[this.__downloadedColumnId];
        var before = rowData[this.__beforeDownloadedColumnId];

        return now+before;
    },

    __calcSumUploading : function(rowData) {
        var now    = rowData[this.__uploadedColumnId];
        var before = rowData[this.__beforeUploadedColumnId];

        return now+before;
    },

    logSelectedRows: function() 
    {
      var tm = this.__tableModel;
      this.__selectionModel.iterateSelection(function(pos) {
        console.log("Position " + pos);
        console.dir(tm.getRowData(pos));
      });
    },

    /**
     * Returns an array of object's ids.
     */
    getSelectedIds: function()
    {
      var ids = [];
      var table = this;
      this.__selectionModel.iterateSelection(function(pos) {
        ids.push(table.__tableModel.getValue(table.__indexColumnId, pos));
      });
      return ids;
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


    __onDataLoadCompleted: function(/*qx.event.type.Data*/ event)
    {
      var data = event.getData();
      
      try
      {
          this.__tableModel.removeRows(
            /* startIndex */ 0, 
            /* howMany */ undefined, 
            /* view */ undefined, 
            /* fireEvent */ false);
      }
      catch (err)
      {
        console.log("Is the table empty?");
      }
      this.__setAllRows(data.rows);
    },


    __onDataAdded: function(/*qx.event.type.Data*/ event)
    {
      var data = event.getData();
      this.__setAllRows(data);
    },

    __setAllRows: function(data)
    {
      var rows = [];

      for (var i in data) {
        var row = data[i];
        rows[i] = this.__fillFields(row, []);
      }
      
      console.log("Bulk update.");
      console.dir(rows);
      this.__tableModel.setData(rows);

      this.updateContent();
    },

    /* The event is from the user. */
    removeSelectedRows: function() 
    {
      this.info("RemoveSelectedRows");

      this.logSelectedRows();
      var table = this;
      // Extract ids, because iterator is not nice.
      var ids = this.getSelectedIds();

      this.__removeIds(ids);
    },


    /* The event is from the server. */
    __onDataRemoved: function(/*qx.event.type.Data*/ event)
    {
      var ids = event.getData().rows;
      this.__removeIds(ids);
    },

    __removeIds: function(ids) {
      for (var i in ids) {
        console.log("Purge from the table entry by real id " + id);
        var id = ids[i];
        var pos = this.__tableModel.locate(this.__indexColumnId, id);
        /* Purge data from the table. */
        if (pos != 'undefined')
          this.__tableModel.removeRows(pos, 1);
      }
    },

    __onDataRemoveFailure: function(/*qx.event.type.Data*/ event)
    {
      var data = event.getOldData();
      this.__tableModel.addRowsAsMapArray([data]);
    },


    particallyUpdateRows: function(Rows)
    {
        for (var i = 0, count = Rows.length; i < count; i++) {
            var row = Rows[i];
            if (typeof(row.id) == 'undefined')
                this.error("Cannot get Rows[i].id");


            var pos = this.__tableModel.locate(this.__indexColumnId, row.id);
            var oldValues = this.__tableModel.getRowData(pos, 
                /*view*/ undefined, /*copy*/ false);
            var newValues = oldValues.slice(0);

            newValues = this.__fillFields(row, newValues);

            /* There is moment, when pos can be changed as result of sorting. 
               Good practice is to add a mutex, but we just decrease the time
               when it can be recalculated.
               */
            pos = this.__tableModel.locate(this.__indexColumnId, row.id);
            this.__tableModel.setRow(pos, newValues);
        }
    },

    /**
     * Set data from row (map from server) to newValues (row in the table).
     */
    __fillFields: function(row, newValues) 
    {
        for (var j in row) {
            var cid = this.__columnNums[j];
            newValues[cid] = row[j];
        }
        
        newValues[this.__sumUploadedColumnId] = 
            this.__calcSumUploading(newValues);
        newValues[this.__sumDownloadedColumnId] = 
            this.__calcSumDownloading(newValues);
        newValues[this.__ratingColumnId] = this.__calcRating(newValues);
        newValues[this.__progressColumnId] = this.__calcProgress(newValues);

        return newValues;
    },


    __onDataUpdated: function(/*qx.event.type.Data*/ event)
    {
      var data = event.getData();
      this.particallyUpdateRows(data.rows);
//    this.updateContent();
    }
  }
});
