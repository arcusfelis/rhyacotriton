
/**
 * The string data cell renderer. All it does is escape the incoming String
 * values.
 */
qx.Class.define("rhyacotriton.cellrenderer.Progress",
{
  extend : qx.ui.table.cellrenderer.Conditional,

  construct : function(calcFn)
  {
    this.__calcFn = calcFn;
    this.base(arguments);
  },

  members :
  {
    __calcFn : null,

    // overridden
    _getContentHtml : function(cellInfo) {
      return this.__calcFn(cellInfo.rowData);
    },

    // overridden
    _getCellClass : function(cellInfo) {
      return "qooxdoo-table-cell-right qooxdoo-table-cell";
    }
  }
}); 

