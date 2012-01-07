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

    // table model
    this.__tableModel = new smart.model.Default;
    this.__tableModel.setColumns(
        /*columnNameArr: */[ "Id", "Name", "Total", "Progress", "Left", 
            "On-line", "Leechers", "Seeders" ],
        /*columnIdArr:   */[ "id", "name", "total", "progress", "left", 
            "online",  "leechers", "seeders" ]);


    // Install tableModel
    this.base(arguments, this.__tableModel);

    this.__tableColumnModel = this.getTableColumnModel();

    this.__onlineColumnId = 
        this.__tableModel.getColumnIndexById("online");
    this.__leftColumnId = 
        this.__tableModel.getColumnIndexById("left");
    this.__totalColumnId = 
        this.__tableModel.getColumnIndexById("total");
    this.__progressColumnId = 
        this.__tableModel.getColumnIndexById("progress");

    this.__tableColumnModel.setColumnVisible(this.__onlineColumnId, false);
    this.__tableColumnModel.setColumnVisible(this.__leftColumnId, false);

    var table = this;
    var proxy = function(rowData) {
            return table.__renderProgress(rowData);
        }
    this.__tableColumnModel.setDataCellRenderer(this.__onlineColumnId,
        new qx.ui.table.cellrenderer.Boolean());
    this.__tableColumnModel.setDataCellRenderer(this.__progressColumnId,
        new rhyacotriton.cellrenderer.Progress(proxy));
    this.__tableColumnModel.setDataCellRenderer(this.__totalColumnId,
        new rhyacotriton.cellrenderer.Size());
    this.__tableColumnModel.setDataCellRenderer(this.__leftColumnId,
        new rhyacotriton.cellrenderer.Size());

    // Get SelectionModel
    this.__selectionModel = this.getSelectionModel();
    this.__selectionModel.setSelectionMode(
      qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION
    );

    // Add the index to SmartTableModel
    this.__indexColumnId = this.__tableModel.getColumnIndexById("id");
    this.__tableModel.indexedSelection(this.__indexColumnId, 
                                       this.__selectionModel);
    this.__tableModel.addIndex(this.__indexColumnId);

    this.__store.addListener("dataRemoved", this.__onDataRemoved, this);
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
    __onlineColumnId: null,
    __leftColumnId: null,
    __totalColumnId: null,
    __progressColumnId: null,

    __tableModel : null,
    __tableColumnModel : null,
    __selectionModel : null,

    __renderProgress : function(rowData) {
        var total      = rowData[this.__totalColumnId];
        var left       = rowData[this.__leftColumnId];
        var completed  = total - left;

        return ((completed / total) * 100).toFixed(2) + "%";
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


    __onDataRemoved: function(/*qx.event.type.Data*/ event)
    {
      var id = event.getData().id;
      console.log("Purge from the table entry by real id " + id);
      
      var pos = this.__tableModel.locate(this.__indexColumnId, id);
      /* Purge data from the table. */
      if (pos != 'undefined')
        this.__tableModel.removeRows(pos, 1);
    },


    __onDataRemoveFailure: function(/*qx.event.type.Data*/ event)
    {
      var data = event.getOldData();
      this.__tableModel.setRowsAsMapArray([data]);
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
