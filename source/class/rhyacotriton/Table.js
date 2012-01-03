/**
 * The GUI definition of the qooxdoo unit test runner.
 */
qx.Class.define("rhyacotriton.Table",
{
  extend : qx.ui.table.Table,

  /**
   * @lint ignoreUndefined(qxc)
   */
  construct : function()
  {
    // table model
    var tableModel = new qx.ui.table.model.Filtered;
    tableModel.setColumns([ "Id", "Name", "Size", "Progress" ]);

    this.base(arguments, tableModel);

    this.getSelectionModel().setSelectionMode(
      qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION
    );

    this.loadData();
  },

  members: {
    logSelectedRows: function() 
    {
      var selModel = this.getSelectionModel();
      var tableModel = this.getTableModel();
      selModel.iterateSelection(function(index) {
        console.log("Index " + index);
          console.dir(tableModel.getRowData(index));
        });
    },

    removeSelectedRows: function() 
    {
      this.logSelectedRows();
    },

    loadData: function()
    {
      var data = [[1, "Erlang", 100000, 0.1], [2, "PHP", 130000, 1.0]];
      //var test = new qx.data.Array; 
      //test = qx.lang.Json.parse(data); 

      var tableModel = this.getTableModel();
      tableModel.setData(data);
    }
  }
});
