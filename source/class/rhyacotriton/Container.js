/**
 * The GUI definition of the qooxdoo unit test runner.
 */
qx.Class.define("rhyacotriton.Container",
{
  extend : qx.ui.container.Composite,
  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    var container = this;

    // Create main layout
    this.__mainLayout = new qx.ui.layout.Dock();
    this.base(arguments, this.__mainLayout);
    this._initializeCommands();

    // Create header
    this.__header = new rhyacotriton.Header();
    this.add(this.__header, {edge: "north"});

    // Create toolbar
    this.__toolBar = new rhyacotriton.ToolBar(this);
    this.add(this.__toolBar, {edge: "north"});

    this.__store = new rhyacotriton.store.Remote;
    this.__store.addListener("stateChanged", 
      function(e) {
        var isEnabled = e.getCurrentTarget().isActive();
        container.setEnabled(isEnabled);
      }, this.__store);

    this.__table = new rhyacotriton.Table(this.__store);
    this.add(this.__table);


    var selModel = this.__table.getSelectionModel();

    // Register action for enabling the buttons when
    // a row is selected.
    selModel.addListener("changeSelection", 
      function(e) {
        var isEnabled = !(e.getCurrentTarget().isSelectionEmpty());
        this.enableRowButtons(isEnabled);
      }, this.__toolBar);

    this.setEnabled(false); 
  },

  members: {
    __mainLayout : null,
    __header : null,
    __toolBar : null,
    __store : null,
    __table : null,
    __commands : null,

    /**
     * Delete selected rows from the table
     */
    removeSelectedRows: function() {
      this.__table.removeSelectedRows();
    },

    startSelectedRows: function() {
      this.__table.startSelectedRows();
    },

    stopSelectedRows: function() {
      this.__table.stopSelectedRows();
    },

    reload: function() {
    },

    showAddTorrent: function() {
    },
    

    /**
     * Get the command with the given command id
     *
     * @param commandId {String} the command's command id
     * @return {qx.ui.core.Command} The command
     */
    getCommand : function(commandId) {
      return this.__commands[commandId];
    },

    /**
     * Initialize commands (shortcuts, ...)
     */
    _initializeCommands : function()
    {
      var commands = {};

      commands.reload = new qx.ui.core.Command("Control+R");
      commands.reload.addListener("execute", this.reload, this);

      commands.addTorrent = new qx.ui.core.Command("Control+A");
      commands.addTorrent.addListener("execute", this.showAddTorrent, this);

      commands.removeSelectedRows = new qx.ui.core.Command("Control+D");
      commands.removeSelectedRows.addListener("execute", this.removeSelectedRows, this);

      commands.startSelectedRows = new qx.ui.core.Command("Control+S");
      commands.startSelectedRows.addListener("execute", this.startSelectedRows, this);

      commands.stopSelectedRows = new qx.ui.core.Command("Control+P");
      commands.stopSelectedRows.addListener("execute", this.stopSelectedRows, this);
      this.__commands = commands;
    },

    setEnabled : function(flag) {
        this.__toolBar.setEnabled(flag);
        this.__table.setEnabled(flag);
    }
  }
});
