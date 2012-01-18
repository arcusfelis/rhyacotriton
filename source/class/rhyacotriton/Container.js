
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
    this.__mainLayout = new qx.ui.layout.Dock();
    this.base(arguments, this.__mainLayout);
    this._initializeCommands();
    this._initStore();

    // Create header
    this.__header = new rhyacotriton.Header();
    this.add(this.__header, { edge : "north" });

    // Create toolbar
    this.__toolBar = new rhyacotriton.ToolBar(this);
    this.add(this.__toolBar, { edge : "north" });

    // Create side panel
    this.__stack = new qx.ui.container.Stack;
    this.__stack.setDecorator("main");
    this.__stack.resetSelection();
    this.__stack.setWidth(200);
    this.__stack.exclude();

    this.__table = new rhyacotriton.Table(this.__store);

    this.__peersTable = new rhyacotriton.peers.Table(this.__store, this.__table);
    this.__logTable = new rhyacotriton.log.Table(this.__store, this.__table);

    this.__filesView = new qx.ui.embed.Html("");
    this.__peersView = this.__peersTable;
    this.__logView = this.__logTable;

    this.__stack.add(this.__filesView);
    this.__stack.add(this.__peersView);
    this.__stack.add(this.__logView);

    this.add(this.__table);

    this.__infosplit = new qx.ui.splitpane.Pane("horizontal");
    this.__infosplit.setDecorator(null);
    this.add(this.__infosplit);

    this.__infosplit.add(this.__table, 2);
    this.__infosplit.add(this.__stack, 1);

    this._initToolbarButtonActivation();

    this.setEnabled(false);
  },

  members :
  {
    __mainLayout : null,
    __header : null,
    __toolBar : null,
    __store : null,
    __table : null,
    __commands : null,


    /**
     * TODOC
     *
     */
    _initStore : function()
    {
      var container = this;

      this.__store = new rhyacotriton.store.Remote;

      this.__store.addListener("stateChanged", function(e)
      {
        var isEnabled = e.getCurrentTarget().isActive();
        container.setEnabled(isEnabled);
      },
      this.__store);
    },


    /**
     * TODOC
     *
     */
    _initToolbarButtonActivation : function()
    {
      var selModel = this.__table.getSelectionModel();

      // Register action for enabling the buttons when
      // a row is selected.
      selModel.addListener("changeSelection", function(e)
      {
        var isEnabled = !(e.getCurrentTarget().isSelectionEmpty());
        this.enableRowButtons(isEnabled);
      },
      this.__toolBar);
    },


    /**
     * Delete selected rows from the table
     *
     */
    removeSelectedRows : function() {
      this.__table.removeSelectedRows();
    },


    /**
     * TODOC
     *
     */
    startSelectedRows : function() {
      this.__table.startSelectedRows();
    },


    /**
     * TODOC
     *
     */
    stopSelectedRows : function() {
      this.__table.stopSelectedRows();
    },


    /**
     * TODOC
     *
     */
    reconnect : function() {
      this.__store.reconnect();
    },


    /**
     * TODOC
     *
     */
    reload : function() {
      this.__store.reload();
    },


    /**
     * TODOC
     *
     */
    showAddTorrent : function() {},


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
     *
     */
    _initializeCommands : function()
    {
      var commands = {};

      commands.reconnect = new qx.ui.core.Command("Control+Shift+R");
      commands.reconnect.addListener("execute", this.reconnect, this);

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


    /**
     * TODOC
     *
     * @param e {Event} TODOC
     */
    syncStackView : function(e)
    {
      var selected = e.getData()[0];
      var show = selected != null ? selected.getUserData("value") : "";
      this.info("Show view: " + show);

      switch(show)
      {
        case "files":
          this.__stack.setSelection([ this.__filesView ]);
          this.__stack.show();
          break;

        case "peers":
          this.__store.reloadPeers();
          this.__stack.setSelection([ this.__peersView ]);
          this.__stack.show();
          break;

        case "log":
          this.__stack.setSelection([ this.__logView ]);
          this.__stack.show();
          break;

        default:
          this.__stack.resetSelection();
          this.__stack.exclude();
      }
    },


    /**
     * TODOC
     *
     * @param flag {Boolean} TODOC
     */
    setEnabled : function(flag)
    {
      this.__toolBar.setEnabled(flag);
      this.__table.setEnabled(flag);
    }
  }
});