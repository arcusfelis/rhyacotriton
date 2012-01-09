
/**
 * The string data cell renderer. All it does is escape the incoming String
 * values.
 */
qx.Class.define("rhyacotriton.cellrenderer.Speed",
{
  extend : qx.ui.table.cellrenderer.Conditional,

  members :
  {
    // overridden
    _getContentHtml : function(cellInfo) {
      return this.bytesToSize(cellInfo.rowData[cellInfo.col], 0);
    },

    // overridden
    _getCellClass : function(cellInfo) {
      return "qooxdoo-table-cell-right qooxdoo-table-cell";
    },

    /**
     * Convert number of bytes into human readable format
     *
     * @param integer bytes     Number of bytes to convert
     * @param integer precision Number of digits after the decimal separator
     * @return string
     */
    bytesToSize : function(bytes, precision)
    {  
      if (isNaN(bytes) || (bytes == 0)) return '0';

      var kilobyte = 1024;

     
      if ((bytes >= 0) && (bytes < kilobyte)) {
        return bytes + ' B/s';
      } else {
        return (bytes / kilobyte).toFixed(precision) + ' KiB/s';
      } 
   }


  }
}); 

