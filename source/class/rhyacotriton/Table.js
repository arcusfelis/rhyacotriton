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
    this.__tableModel.setColumns(
        /*columnNameArr: */[ "Id", "Name", "Total", "Left", "Progress", "Rating",
            "On-line", "Ss", "Ls", "State",
            "Downloaded Now", "Uploaded Now", 
            "uploaded Before", "Downloaded Before",
            "Total downloaded", "Total uploaded"
            ],
        /*columnIdArr:   */[ "id", "name", "total", "left", "progress", "rating",
            "online", "seeders",  "leechers", "state",
            "downloaded", "uploaded",
            "all_time_uploaded", "all_time_downloaded",
            "sum_downloaded", "sum_uploaded"
            ]);


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



    this.__tableColumnModel.setColumnWidth(this.__nameColumnId, 300, true);
    this.__tableColumnModel.setColumnWidth(this.__indexColumnId, 30, true);
    this.__tableColumnModel.setColumnWidth(this.__progressColumnId, 70, true);
    this.__tableColumnModel.setColumnWidth(this.__totalColumnId, 70, true);
    this.__tableColumnModel.setColumnWidth(this.__leftColumnId, 70, true);
    this.__tableColumnModel.setColumnWidth(this.__leechersColumnId, 40, true);
    this.__tableColumnModel.setColumnWidth(this.__seedersColumnId, 40, true);
    this.__tableColumnModel.setColumnWidth(this.__stateColumnId, 70, true);
    this.__tableColumnModel.setColumnWidth(this.__ratingColumnId, 70, true);
    this.__tableColumnModel.setColumnWidth(this.__beforeDownloadedColumnId, 
        70, true);
    this.__tableColumnModel.setColumnWidth(this.__beforeUploadedColumnId, 70, true);
    this.__tableColumnModel.setColumnWidth(this.__downloadedColumnId, 70, true);
    this.__tableColumnModel.setColumnWidth(this.__uploadedColumnId, 70, true);

    var progressProxy = function(rowData) {
            return table.__calcProgress(rowData);
        }
    var ratingProxy = function(rowData) {
            return table.__calcRating(rowData);
        }
    this.__tableColumnModel.setDataCellRenderer(this.__progressColumnId,
        new rhyacotriton.cellrenderer.Progress(progressProxy));
    this.__tableColumnModel.setDataCellRenderer(this.__ratingColumnId,
        new rhyacotriton.cellrenderer.Rating(ratingProxy));
    this.__tableColumnModel.setDataCellRenderer(this.__onlineColumnId,
        new qx.ui.table.cellrenderer.Boolean());
    
    [this.__totalColumnId
    ,this.__leftColumnId
    ,this.__downloadedColumnId
    ,this.__uploadedColumnId
    ,this.__beforeDownloadedColumnId
    ,this.__beforeUploadedColumnId
    ].map(function(id) {
        table.__tableColumnModel.setDataCellRenderer(id,
            new rhyacotriton.cellrenderer.Size());
    });

    var sumDownProxy = function(rowData) {
            return table.__calcSumDownloading(rowData);
        }
    var sumUpProxy = function(rowData) {
            return table.__calcSumUploading(rowData);
        }
    table.__tableColumnModel.setDataCellRenderer(this.__sumDownloadedColumnId,
        new rhyacotriton.cellrenderer.Size(sumDownProxy));
    table.__tableColumnModel.setDataCellRenderer(this.__sumUploadedColumnId,
        new rhyacotriton.cellrenderer.Size(sumUpProxy));

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

    __tableModel : null,
    __tableColumnModel : null,
    __selectionModel : null,

    __calcProgress : function(rowData) {
        var total      = rowData[this.__totalColumnId];
        var left       = rowData[this.__leftColumnId];
        var completed  = total - left;

        return ((completed / total) * 100).toFixed(2) + "%";
    },

    __calcRating : function(rowData) {
        var up    = rowData[this.__uploadedColumnId];
        var down  = rowData[this.__downloadedColumnId];
        var tup   = rowData[this.__beforeUploadedColumnId];
        var tdown = rowData[this.__beforeDownloadedColumnId];

        if (down == 0) return 0;
        return ((up+tup) / (down+tdown)).toFixed(2);
    },

    __calcSumDownloading : function(rowData) {
        var down  = rowData[this.__downloadedColumnId];
        var tdown = rowData[this.__beforeDownloadedColumnId];

        return (down+tdown);
    },

    __calcSumUploading : function(rowData) {
        var up    = rowData[this.__uploadedColumnId];
        var tup   = rowData[this.__beforeUploadedColumnId];

        return (up+tup);
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

    removeSelectedRows: function() 
    {
      this.info("RemoveSelectedRows");

      this.logSelectedRows();
      var table = this;
      this.__selectionModel.iterateSelection(function(pos) {
        console.log("Position " + pos);
        var row = table.__tableModel.getRowDataAsMap(pos);
        table.__store.removeElement(row);
        table.__tableModel.removeRows(pos, 1);
      });
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
      this.__tableModel.setDataAsMapArray(data.rows);

      this.updateContent();
    },


    __onDataAdded: function(/*qx.event.type.Data*/ event)
    {
      var data = event.getData();
      
      this.__tableModel.setDataAsMapArray(data.rows);

      this.updateContent();
    },


    __onDataRemoved: function(/*qx.event.type.Data*/ event)
    {
      var rows = event.getData().rows;

      for (var i in rows) {
        console.log("Purge from the table entry by real id " + id);
        var id = rows[i];
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
            for (var j in row) {
                if (j == "id") continue;
                var columnId = this.__tableModel.getColumnIndexById(j);
                this.__tableModel.setValue(columnId, pos, row[j]);
            }
        }
    },

    __onDataUpdated: function(/*qx.event.type.Data*/ event)
    {
      var data = event.getData();
      this.particallyUpdateRows(data.rows);
      this.updateContent();
    }
  }
});
