/**
 * The GUI definition of the qooxdoo unit test runner.
 */
qx.Class.define("rhyacotriton.store.Remote",
{
  extend: rhyacotriton.store.Abstract,
  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    this.base(arguments);

    /*
      var newValues = [{"online": true}];
      this.fireDataEvent("dataEdited", {"id": id, "data": newValues});
    */
    var basedir = document.location.href; 
    // Form url with ws:// protocol
    basedir = basedir.replace('http:', 'ws:').replace('https:', 'wss:');
    // basedir of url
    basedir = basedir.substring(0, basedir.lastIndexOf('/')) + '/';
    // url of the bullet handler
    var url = basedir + "stream"; 

    var bullet = $.bullet(url);
    var store = this;
    this.__bullet = bullet;

    bullet.onopen = function(){
      console.log('WebSocket: opened');

      store.sendText("get_entire_torrent_list");

      store.setActive(true);
      store.fireEvent("stateChanged");
    };
    bullet.onclose = function(){
        console.log('WebSocket: closed');

      store.setActive(false);
      store.fireEvent("stateChanged");
    };
    bullet.onmessage = function(e){
        console.log('WebSocket: ' + e.data);
        var parsedData = qx.lang.Json.parse(e.data);
        console.dir(parsedData);
        store.fireDataEvent(parsedData.event, parsedData.data);
    };
    bullet.onheartbeat = function(){
        console.log('WebSocket: heartbeat');
    }
  },

  members: {
    __bullet : null,

    sendJSON : function(query) {
      this.__bullet.send(
        qx.lang.Json.stringify(query));
    },
    sendText : function(query) {
      this.__bullet.send(query);
    },

    /**
     * Implementation of abstract functions.
     */
    loadData : function() {
      
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
  }
});
