/**
 * The GUI definition of the qooxdoo unit test runner.
 */
qx.Class.define("rhyacotriton.store.Abstract",
{
  extend: qx.core.Object,

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
  },

  members: {
    __isActive : true,
    reconnect : function() {},
    reload : function() {},
    reloadPeers : function() {},
    removeElement : function(/*Map*/ oldData) {},  
    stop : function(/*Array*/ ids) {},  
    start : function(/*Array*/ ids) {},

    isActive : function() { return this.__isActive; },
    setActive : function(flag) { this.__isActive = flag; },
    
    /**
     * This functions allows to sort pids in the table.
     */
    buildPidComparator : function(pos) {
      return function(row1, row2) {
        var pid1 = row1[pos];
        var pid2 = row2[pos];
        pid1 = pid1.substr(2, pid1.length - 1).split(".");
        pid2 = pid2.substr(2, pid2.length - 1).split(".");
        var order = [0,2,1];

        for (var i = 0; i < 3; i++) {
          var num  = order[i];
          var bit1 = parseInt(pid1[num]);
          var bit2 = parseInt(pid2[num]);
          if (bit1 < bit2) return -1;
          if (bit1 > bit2) return 1;
        }
        return 0;
      };
    },

    /**
     * This functions allows to sort IP adresses in the table.
     */
    buildIPComparator : function(pos) {
      return function(row1, row2) {
        var ip1 = row1[pos].split(".");
        var ip2 = row2[pos].split(".");

        for (var i = 0; i < 4; i++) {
          var bit1 = parseInt(ip1[i]);
          var bit2 = parseInt(ip2[i]);
          if (bit1 < bit2) return -1;
          if (bit1 > bit2) return 1;
        }
        return 0;
      };
    }
  },

  events: {
    "stateChanged" : "qx.event.type.Event", 

    /**
     * Dispatched after a respond is trasmitted from server.
     *
     * The data is a map containing this properties:
     * <ul>
     *   <li>rows : [{id, ...}]</li>
     * </ul>
     */
    "dataUpdated" : "qx.event.type.Data", 

    /**
     * Dispatched after a respond is trasmitted from server.
     *
     * The data is a map containing this properties:
     * <ul>
     *   <li>rows (of ids)</li>
     * </ul>
     */
    "dataRemoved" : "qx.event.type.Data", 

    /**
     * Dispatched after a respond is trasmitted from server.
     *
     * The data is a map containing this properties:
     * <ul>
     *   <li>id</li>
     * </ul>
     */
    "dataRemoveFailure" : "qx.event.type.Data",

    /**
     * Load a full set of data from server.
     *
     * The data is a map containing this properties:
     * <ul>
     *   <li>rows</li>
     * </ul>
     */
    "dataLoadCompleted" : "qx.event.type.Data",
    "peerDataLoadCompleted" : "qx.event.type.Data",

    /**
     * Load a full set of data from server.
     *
     * The data is a map containing this properties:
     * <ul>
     *   <li>rows</li>
     * </ul>
     */
    "dataAdded" : "qx.event.type.Data"
  }
});
