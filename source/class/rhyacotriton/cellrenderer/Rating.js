
/**
 * The string data cell renderer. All it does is escape the incoming String
 * values.
 */
qx.Class.define("rhyacotriton.cellrenderer.Rating",
{
  extend : qx.ui.table.cellrenderer.Conditional,


  members :
  {
    // overridden
    _getContentHtml : function(cellInfo) {
      return cellInfo.rowData[cellInfo.col];
    },

    // overridden
    _getCellClass : function(cellInfo) {
      return "qooxdoo-table-cell-right qooxdoo-table-cell";
    }
  }
}); 

