
/**
 * The GUI definition of the qooxdoo unit test runner.
 */
qx.Class.define("rhyacotriton.BasicTable",
{
  extend : qx.ui.table.Table,


  /**
   * @lint ignoreUndefined(qxc)
   */
  construct : function(names)
  {
    // INIT TABLE MODEL
    // table model
    this.__tableModel = new smart.model.Default;

    // SET COLUMN NAMES (do it before running the base constructor)
    this.__columnsNameToCaption = names;

    this.__columnNums = [];
    this.__columnNames = [];
    this.__columnCaptions = [];

    var i = 0;

    for (var name in this.__columnsNameToCaption)
    {
      var caption = this.__columnsNameToCaption[name];
      this.__columnNums[name] = i;
      this.__columnNames[i] = name;
      this.__columnCaptions[i] = caption;
      i++;
    }

    delete i;

    this.__tableModel.setColumns(this.__columnCaptions, this.__columnNames);

    // Install tableModel
    this.base(arguments, this.__tableModel);

    // INIT SELECTION MODEL
    var sm = this.__selectionModel = this.getSelectionModel();
    sm.setSelectionMode(qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION);

    var n2p = this.getColumnNameToPositionIndex();

    var tm = this.__tableModel;

    // Add the index to SmartTableModel
    tm.indexedSelection(n2p.id, sm);
    tm.addIndex(n2p.id);

    // INIT EVENT HANDLERS
    this.__eventHandlers =
    {
      "dataAdded"         : this.__onDataAdded,
      "dataRemoved"       : this.__onDataRemoved,
      "dataRemoveFailure" : this.__onDataRemoveFailure,
      "dataLoadCompleted" : this.__onDataLoadCompleted,
      "dataUpdated"       : this.__onDataUpdated
    };
  },

  members :
  {
    __tableModel : null,
    __selectionModel : null,
    __eventHandlers : null,
    __columnNums : null,
    __columnNames : null,
    __columnCaptions : null,


    /**
     * INITIALIZATION PART
     *
     * @param names {var} TODOC
     */
    setColumnNames : function(names) {},


    /**
     * HELPERS
     *
     * @return {var} TODOC
     */
    getColumnNameToPositionIndex : function() {
      return this.__columnNums;
    },


    /**
     * TODOC
     *
     */
    logSelectedRows : function()
    {
      var tm = this.__tableModel;

      this.__selectionModel.iterateSelection(function(pos)
      {
        console.log("Position " + pos);
        console.dir(tm.getRowData(pos));
      });
    },


    /**
     * Returns an array of object's ids.
     *
     * @return {var} TODOC
     */
    getSelectedIds : function()
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
     *
     * @param Rows {var} TODOC
     */
    particallyUpdateRows : function(Rows)
    {
      var tm = this.__tableModel;
      var n2p = this.getColumnNameToPositionIndex();

      for (var i=0, count=Rows.length; i<count; i++)
      {
        var row = Rows[i];
        if (typeof (row.id) == 'undefined') this.error("Cannot get Rows[i].id");

        var pos = tm.locate(n2p.id, row.id);

        if (isNaN(pos))
        {
          this.error("Cannot locate row.");
          continue;
        }

        var oldValues = tm.getRowData(pos,

        /* view */ undefined, /* copy */ false);

        if (typeof (oldValues) != "object")
        {
          this.error("Cannot retrieve old values.");
          continue;
        }

        var newValues = oldValues.slice(0);

        newValues = this.fillFields(row, newValues, false);

        /* There is moment, when pos can be changed as result of sorting. 
           Good practice is to add a mutex, but we just decrease the time
           when it can be recalculated.
           */

        var pos = tm.locate(n2p.id, row.id);
        tm.setRow(pos, newValues);
      }
    },

    /* The event is from the user. */

    /**
     * TODOC
     *
     */
    removeSelectedRows : function()
    {
      this.info("RemoveSelectedRows");

      this.logSelectedRows();
      var table = this;

      // Extract ids, because iterator is not nice.
      var ids = this.getSelectedIds();

      this.__removeIds(ids);
    },


    /**
     * TODOC
     *
     * @param data {var} TODOC
     */
    addRows : function(data)
    {
      var rows = [];

      for (var i in data)
      {
        var row = data[i];
        rows[i] = this.fillFields(row, [], true);
      }

      this.debug("Bulk update.");

      this.__tableModel.addRows(rows, /* copy */ true, /* fireEvent */ false);

      this.updateContent();
    },


    /**
     * TODOC
     *
     * @param ids {var} TODOC
     */
    __removeIds : function(ids)
    {
      for (var i in ids)
      {
        this.info("Purge from the table entry by real id " + id);
        var id = ids[i];
        var pos = this.__tableModel.locate(this.__indexColumnId, id);

        /* Purge data from the table. */

        if (pos != 'undefined') this.__tableModel.removeRows(pos, 1);
      }
    },


    /**
     * Set data from row (map from server) to newValues (row in the table).
     *
     * @param row {var} TODOC
     * @param newValues {var} TODOC
     * @param add {var} TODOC
     * @return {var} TODOC
     */
    fillFields : function(row, newValues, add)  /* boolean : add or update */
    {
      var n2p = this.getColumnNameToPositionIndex();

      for (var j in row)
      {
        var cid = n2p[j];
        newValues[cid] = row[j];
      }

      return newValues;
    },


    /**
     * EVENT HANDLERS
     *
     * @param name {var} TODOC
     * @return {var} TODOC
     */
    getEventHandler : function(name) {
      return this.__eventHandlers[name];
    },


    /**
     * TODOC
     *
     * @param event {var} TODOC
     */
    __onDataLoadCompleted : function( /* qx.event.type.Data */ event)
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
      catch(err)
      {
        this.debug("Is the table empty?");
      }

      this.addRows(data.rows);
    },


    /**
     * TODOC
     *
     * @param event {var} TODOC
     */
    __onDataAdded : function( /* qx.event.type.Data */ event)
    {
      var data = event.getData();
      this.addRows(data.rows);
    },

    /* The event is from the server. */

    /**
     * TODOC
     *
     * @param event {qx.event.type.Data} TODOC
     */
    __onDataRemoved : function(event)
    {
      var ids = event.getData().rows;
      this.__removeIds(ids);
    },


    /**
     * TODOC
     *
     * @param event {qx.event.type.Data} TODOC
     */
    __onDataUpdated : function(event)
    {
      var data = event.getData();
      this.particallyUpdateRows(data.rows);
    },

    __oldSelection : [],


    /**
     * TODOC
     *
     * @param torrents {var} TODOC
     */
    initFilters : function(torrents)
    {
      var n2p = this.getColumnNameToPositionIndex();
      var tm = this.getTableModel();

      var unfilteredView = tm.getView();

      var filteredView = tm.addView(function(row)
      {
        var tid = row[n2p.torrent_id];
        return (this.__oldSelection.indexOf(tid) != -1);
      },
      this);

      var tsm = torrents.getSelectionModel();
      tsm.addListener("changeSelection", this.updateFilters, this);
    },


    /**
     * TODOC
     *
     */
    updateFilters : function()
    {
      this.info("change selection");
      var tm = this.__tableModel;

      var newSel = torrents.getSelectedIds();
      if (this.__oldSelection == newSel) return;

      this.__oldSelection = newSel;

      if (newSel.length == 0) {
        tm.setView(unfilteredView);
      }
      else
      {
        if (tm.getView() != filteredView) tm.setView(filteredView);
        tm.updateView(filteredView);
      }
    }
  }
});