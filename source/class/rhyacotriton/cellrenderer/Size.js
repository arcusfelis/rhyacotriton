
/**
 * The string data cell renderer. All it does is escape the incoming String
 * values.
 */
qx.Class.define("rhyacotriton.cellrenderer.Size",
{
  extend : qx.ui.table.cellrenderer.Conditional,

  construct : function(calcFn /*?*/)
  {
    if (typeof(calcFn) != "undefined")
        this.__calcFn = calcFn;
    this.base(arguments);
  },


  members :
  {
    __calcFn : undefined,

    // overridden
    _getContentHtml : function(cellInfo) {
      var value; 
      value = (typeof(this.__calcFn) == "undefined") 
            ? cellInfo.rowData[cellInfo.col] 
            : this.__calcFn(cellInfo.rowData);
      return this.bytesToSize(value, 2);
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
      var kilobyte = 1024;
      var megabyte = kilobyte * 1024;
      var gigabyte = megabyte * 1024;
      var terabyte = gigabyte * 1024;
     
      if ((bytes >= 0) && (bytes < kilobyte)) {
        return bytes + ' B';
    
      } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
        return (bytes / kilobyte).toFixed(precision) + ' KB';
    
      } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
        return (bytes / megabyte).toFixed(precision) + ' MB';
    
      } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
        return (bytes / gigabyte).toFixed(precision) + ' GB';
    
      } else if (bytes >= terabyte) {
        return (bytes / terabyte).toFixed(precision) + ' TB';
    
      } else {
        return bytes + ' B';
      }
    }


  }
}); 

