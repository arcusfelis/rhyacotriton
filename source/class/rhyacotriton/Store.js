/**
 * The GUI definition of the qooxdoo unit test runner.
 */
qx.Class.define("rhyacotriton.Store",
{
  extend: qx.core.Object,
  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    /*
      var newValues = [{"online": true}];
      this.fireDataEvent("dataEdited", {"id": id, "data": newValues});
    */
  },

  members: {
    loadData : function() {
      var data = {"data":
                     [{id: 1 
                      ,name: "Erlang" 
                      ,size: 100000 
                      ,progress: 0.1 
                      ,online: true} 
                     ,{id: 2 
                      ,name: "PHP" 
                      ,size: 130000
                      ,progress: 1.0
                      ,online: false}]
                 };
      //var test = new qx.data.Array; 
      //test = qx.lang.Json.parse(data); 
      
      this.fireDataEvent("dataLoadCompleted", data);
    },

    removeElement : function(/*arrayMap*/ oldData) {
      var id = oldData.id;
      var newData = {"id": id};
      //this.fireDataEvent("dataRemoved", newData, oldData);
      this.fireDataEvent("dataRemoveFailure", newData, oldData);
    },  

    stop : function(/*Array*/ ids) {
        
    },  

    start : function(/*Array*/ ids) {
      //this.fireDataEvent("dataUpdated", {"data": [{"id": 1, "name": "test"}]});
    }

//this.fireDataEvent("columnVisibilityMenuCreateStart", data);
  },
  events: {
    /**
     * Dispatched after a respond is trasmitted from server.
     *
     * The data is a map containing this properties:
     * <ul>
     *   <li>data</li>
     *   <li>[{id, ...}]</li>
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
     *   <li>data</li>
     * </ul>
     */
    "dataLoadCompleted" : "qx.event.type.Data"
  }
});
