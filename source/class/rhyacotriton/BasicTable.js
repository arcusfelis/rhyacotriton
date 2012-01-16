
/**
 * The GUI definition of the qooxdoo unit test runner.
 */
qx.Class.define("rhyacotriton.CommonTable",
{
  extend : qx.ui.table.Table,

  /**
   * @lint ignoreUndefined(qxc)
   */
  construct : function(names)
  {
    this._initTableModel();
    this.setColumnNames(names);
    this._initSelectionModel();
    this._initEventHandlers();
  },


  members: {

    __tableModel : null,
    __tableColumnModel : null,
    __selectionModel : null,


    /**
     * INITIALIZATION PART
     */


    setColumnNames : function(names) {
      this.__columnsNameToCaption = names;
      
      
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
      
      this.__tableModel.setColumns(
          this.__columnCaptions,
          this.__columnNames);

    },

 
    _initTableModel : function()
    {
      // table model
      this.__tableModel = new smart.model.Default;
 
      // Install tableModel
      this.base(arguments, this.__tableModel);
 
      this.__tableColumnModel = this.getTableColumnModel();
    },
 
 
    _initSelectionModel : function()
    {
      // Get SelectionModel
      var sm = this.__selectionModel = this.getSelectionModel();
      sm.setSelectionMode(
        qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION
      );
 
      var n2p = this.getColumnNameToPositionIndex();
 
      var tm = this.__tableModel;
      // Add the index to SmartTableModel
      tm.indexedSelection(n2p.id, sm);
      tm.addIndex(n2p.id);
    },


    _initEventHandlers: function()
    {
      this.__eventHandlers = {
          "dataAdded"         : this.__onDataAdded,
          "dataRemoved"       : this.__onDataRemoved,
          "dataRemoveFailure" : this.__onDataRemoveFailure,
          "dataLoadCompleted" : this.__onDataLoadCompleted, 
          "dataUpdated"       : this.__onDataUpdated
      };
    },

    /**
     * HELPERS
     */


    getColumnNameToPositionIndex : function()
    {
      return this.__columnNums;
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
      var tm = this.__tableModel;
      var n2p = this.getColumnNameToPositionIndex();
      this.__selectionModel.iterateSelection(function(pos) {
        ids.push(tm.getValue(n2p.id, pos));
      });
      return ids;
    },



    /**
     * DATA MANAGEMENT
     */


    particallyUpdateRows: function(Rows)
    {
      var tm = this.__tableModel;
      var n2p = this.getColumnNameToPositionIndex();

      for (var i = 0, count = Rows.length; i < count; i++) {
        var row = Rows[i];
        if (typeof(row.id) == 'undefined')
          this.error("Cannot get Rows[i].id");


        var pos = tm.locate(n2p.id, row.id);
        if (isNaN(pos)) {
          this.error("Cannot locate row.");
          continue;
        }
        var oldValues = tm.getRowData(pos, 
            /*view*/ undefined, /*copy*/ false);

        if (typeof(oldValues) != "object") {
          this.error("Cannot retrieve old values.");
          continue;
        }
        var newValues = oldValues.slice(0);

        newValues = this.fillFields(row, newValues, true);

        /* There is moment, when pos can be changed as result of sorting. 
           Good practice is to add a mutex, but we just decrease the time
           when it can be recalculated.
           */
        var pos = tm.locate(n2p.id, row.id);
        tm.setRow(pos, newValues);
      }
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


    __addRows: function(data)
    {
      var rows = [];

      for (var i in data) {
        var row = data[i];
        rows[i] = this.fillFields(row, [], true);
      }
      
      this.debug("Bulk update.");
      //console.dir(rows);
      this.__tableModel.addRows(rows, /*copy*/ true, /*fireEvent*/ false);

      this.updateContent();
    },



    /**
     * THESE FUNCTIONS CAN BE REWRITTEN
     */


    /**
     * Set data from row (map from server) to newValues (row in the table).
     */
    fillFields: function(row, newValues, add /* boolean : add or update */) 
    {
      var n2p = this.getColumnNameToPositionIndex();

      for (var j in row) {
        var cid = n2p[j];
        newValues[cid] = row[j];
      }
      
      return newValues;
    },



    /**
     * EVENT HANDLERS
     */



    getEventHandler : function(name) 
    {
      return this.__eventHandlers[name];
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
        this.debug("Is the table empty?");
      }
      this.__addRows(data.rows);
    },


    __onDataAdded: function(/*qx.event.type.Data*/ event)
    {
      var data = event.getData();
      this.__addRows(data.rows);
    },


    /* The event is from the server. */
    __onDataRemoved: function(/*qx.event.type.Data*/ event)
    {
      var ids = event.getData().rows;
      this.__removeIds(ids);
    }
  }
});
