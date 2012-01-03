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
    // Create main layout
    var dockLayout = new qx.ui.layout.Dock();
    this.base(arguments, dockLayout);
    this._initializeCommands();

    // Create header
    this.__header = new rhyacotriton.Header();
    this.add(this.__header, {edge: "north"});

    // Create toolbar
    this.__toolBar = new rhyacotriton.ToolBar(this);
    this.add(this.__toolBar, {edge: "north"});

    this.__table = new rhyacotriton.Table;
    this.add(this.__table);


      var selModel = this.__table.getSelectionModel();

    // Register action for enabling the buttons when
    // a row is selected.
    selModel.addListener("changeSelection", 
      function(e) {
        var isEnabled = !(e.getCurrentTarget().isSelectionEmpty());
        this.enableRowButtons(isEnabled);
      }, this.__toolBar);
  },

  members: {

    /**
     * Delete selected rows from the table
     */
    removeSelectedRows: function() {
      this.__table.removeSelectedRows();
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

      this.__commands = commands;
    }

  }
});
