
/**
 * The GUI definition of the qooxdoo unit test runner.
 */
qx.Class.define("rhyacotriton.store.Remote",
{
  extend : rhyacotriton.store.Abstract,




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
  },

  members :
  {
    __bullet : null,
    __url : null,

    
    finalize : function()
    {
      this.__openConnection();
    },
    

    /**
     * TODOC
     *
     * @param query {var} TODOC
     */
    sendJSON : function(query) {
      this.__bullet.send(qx.lang.Json.stringify(query));
    },


    /**
     * TODOC
     *
     * @param query {var} TODOC
     */
    sendText : function(query) {
      this.__bullet.send(query);
    },
    //
    // Implementation of abstract functions.
    //
    /**
     * Create new connection to the server
     *
     */
    reconnect : function()
    {
      this.__closeConnection();
      this.__openConnection();
    },


    /**
     * Refresh the table
     *
     */
    reload : function() {
      this.sendText("all_torrents");
    },


    /**
     * TODOC
     *
     */
    reloadPeers : function() {
      this.sendText("all_peers");
    },


    /**
     * TODOC
     *
     * @param oldData {var} TODOC
     */
    removeElement : function( /* arrayMap */ oldData)
    {
      var id = oldData.id;

      //var newData = {"id": id};
      //this.fireDataEvent("dataRemoved", newData, oldData);
      //this.fireDataEvent("dataRemoveFailure", newData, oldData);
      this.sendJSON(
      {
        "event" : "remove",
        "id"    : id
      });
    },


    /**
     * TODOC
     *
     * @param ids {var} TODOC
     */
    stop : function( /* Array */ ids)
    {
      this.sendJSON(
      {
        "event" : "pause",
        "ids"   : ids
      });
    },

    addTorrent : function( /* Object */ data)
    {
      data.event = "add_torrent";
      this.sendJSON(data);
    },

    getFileTreeNode : function(tid, nids) 
    {
      this.sendJSON(
      {
        "event"      : "file_list",
        "torrent_id" : tid,
        "parent_ids" : nids
      });
    },

    getWishes : function(tid) 
    {
      this.sendJSON(
      {
        "event"       : "wish_list",
        "torrent_id"  : tid
      });
    },

    setWishes : function(tid, list) 
    {
      this.sendJSON(
      {
        "event"       : "replace_wish_list",
        "torrent_id"  : tid,
        "list"        : list
      });
    },

    wishSelectedFiles : function(tid, nids) 
    {
      this.sendJSON(
      {
        "event"      : "wish_files",
        "torrent_id" : tid,
        "file_ids"   : nids
      });
    },

    skipSelectedFiles : function(tid, nids) 
    {
      this.sendJSON(
      {
        "event"      : "skip_files",
        "torrent_id" : tid,
        "file_ids"   : nids
      });
    },

    unskipSelectedFiles : function(tid, nids) 
    {
      this.sendJSON(
      {
        "event"      : "unskip_files",
        "torrent_id" : tid,
        "file_ids"   : nids
      });
    },

    /**
     * TODOC
     *
     * @param ids {var} TODOC
     */
    start : function( /* Array */ ids)
    {
      this.sendJSON(
      {
        "event" : "continue",
        "ids"   : ids
      });
    },
    //
    // Private functions
    //
    /**
     * TODOC
     *
     */
    __openConnection : function()
    {
      var bullet = $.bullet(this.__url);
      var store = this;
      this.__bullet = bullet;

      bullet.onopen = function()
      {
        store.info('WebSocket: opened');

        store.sendText("all_torrents");

        store.setActive(true);
        store.fireEvent("stateChanged");
      };

      bullet.onclose = function()
      {
        store.info('WebSocket: closed');

        store.setActive(false);
        store.fireEvent("stateChanged");
      };

      bullet.onmessage = function(e)
      {
        store.info('WebSocket: ' + e.data);
        var parsedData = qx.lang.Json.parse(e.data);
        store.fireDataEvent(parsedData.event, parsedData.data);
      };

      bullet.onheartbeat = function() {
        store.info('WebSocket: heartbeat');
      };
    },


    /**
     * TODOC
     *
     */
    __closeConnection : function()
    {
      try {
        this.__bullet.close();
      } catch(err) {
        this.error("There are some problems with bullet.", err);
      }
      var self = this;

      // Cannot purge it fully.
      // Avoid few connections.
      this.__bullet.onclose = function() {
        self.info("Old connection was closed");
      };

      this.__bullet.onmessage = function() {
        self.error("FIXME: deads are alive.");
      };

      this.__bullet.onheartbeat = this.__bullet.onmessage;
      this.__bullet.onclose = function() {};
      delete this.__bullet;
    }
  }
});

//this.fireDataEvent("columnVisibilityMenuCreateStart", data);
