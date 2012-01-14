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
    this.__url = basedir + "stream"; 
    
    this.__openConnection();
  },

  members: {
    __bullet : null,
    __url : null,

    sendJSON : function(query) {
      this.__bullet.send(
        qx.lang.Json.stringify(query));
    },
    sendText : function(query) {
      this.__bullet.send(query);
    },

    // 
    // Implementation of abstract functions.
    // 

    /**
     * Create new connection to the server
     */
    reconnect : function() {
        this.__closeConnection();
        this.__openConnection();
    },

    /**
     * Refresh the table
     */
    reload : function() {
        this.sendText("get_entire_torrent_list");
    },

    removeElement : function(/*arrayMap*/ oldData) {
      var id = oldData.id;
      //var newData = {"id": id};
      //this.fireDataEvent("dataRemoved", newData, oldData);
      //this.fireDataEvent("dataRemoveFailure", newData, oldData);

      this.sendJSON({"event" : "remove", "id" : id});
    },  

    stop : function(/*Array*/ ids) {
      this.sendJSON({"event" : "pause", "ids" : ids});
    },  

    start : function(/*Array*/ ids) {
      this.sendJSON({"event" : "continue", "ids" : ids});
    },


    // 
    // Private functions
    // 

    __openConnection : function() {
        var bullet = $.bullet(this.__url);
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
    __closeConnection : function() {
        try {
            this.__bullet.close();
        } catch (err) {
            console.log("There are some problems with bullet.");
        }
        // Cannot purge it fully.
        // Avoid few connections.
        this.__bullet.onclose = function() { 
            console.log("Old connection was closed");
        };
        this.__bullet.onmessage = function() { 
            console.log("FIXME: deads are alive.");
        }
        this.__bullet.onheartbeat = this.__bullet.onmessage;
        this.__bullet.onclose = function() {};
        delete this.__bullet;
    }
//this.fireDataEvent("columnVisibilityMenuCreateStart", data);
  }
});
