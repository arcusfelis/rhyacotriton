
/**
 * The string data cell renderer. All it does is escape the incoming String
 * values.
 */
qx.Class.define("rhyacotriton.cellrenderer.Speed",
{
  extend : qx.ui.table.cellrenderer.Conditional,

  members :
  {
    __calcFn : undefined,

    // overridden
    _getContentHtml : function(cellInfo) {
      var value; 
      value = cellInfo.rowData[cellInfo.col];
      return this.bytesToSize(value, 0);
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
      var megabyte = kilobyte * 1024;
      var gigabyte = megabyte * 1024;
      var terabyte = gigabyte * 1024;

     
      if ((bytes >= 0) && (bytes < kilobyte)) {
        return bytes + ' B/s';
    
      } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
        return (bytes / kilobyte).toFixed(precision) + ' KiB/s';
    
      } else {
        return (bytes / megabyte).toFixed(precision) + ' MiB/s';
      }  
   }


  }
}); 

