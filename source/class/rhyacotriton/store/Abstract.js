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
    loadData : function() {},
    removeElement : function(/*Map*/ oldData) {},  
    stop : function(/*Array*/ ids) {},  
    start : function(/*Array*/ ids) {},

    isActive : function() { return this.__isActive; },
    setActive : function(flag) { this.__isActive = flag; }
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
     *   <li>id</li>
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
    "dataLoadCompleted" : "qx.event.type.Data"
  }
});
