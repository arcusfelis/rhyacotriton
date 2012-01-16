/**
 * The GUI definition of the qooxdoo unit test runner.
 */
qx.Class.define("rhyacotriton.peers.Table",
{
  extend : rhyacotriton.BasicTable,

  /**
   * @lint ignoreUndefined(qxc)
   */
  construct : function(store)
  {
    var n2c = {
        "id"       : "Pid",
        "ip"       : "IP",
        "port"     : "Port",
        "torrent_id" : "Torrent id",
        "state"    : "State"
    };

    this.base(arguments, n2c);
  },

  members: {
  }
});
