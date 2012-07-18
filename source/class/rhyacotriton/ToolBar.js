/* ************************************************************************

#asset(qx/icon/Tango/22/actions/list-add.png)
#asset(qx/icon/Tango/22/actions/list-remove.png)
#asset(qx/icon/Tango/22/actions/media-playback-start.png)
#asset(qx/icon/Tango/22/actions/media-playback-pause.png)

// Refresh
#asset(qx/icon/Tango/22/actions/view-refresh.png)

// Wish files
#asset(qx/icon/Tango/22/actions/dialog-apply.png)

// Wishes
#asset(qx/icon/Tango/22/actions/view-sort-descending.png)

// Reconnect
#asset(qx/icon/Tango/22/devices/network-wired.png)

// Logs
#asset(qx/icon/Tango/22/apps/utilities-log-viewer.png)

// ?
#asset(qx/icon/Tango/22/apps/preferences-users.png)

// Files
#asset(qx/icon/Tango/22/places/folder-open.png)

************************************************************************ */

/**
 * The main tool bar widget
 */
qx.Class.define("rhyacotriton.ToolBar",
{
  extend : qx.ui.toolbar.ToolBar,




  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param controller {rhyacotriton.Application} The main application class
   */
  construct : function(controller)
  {
    this.base(arguments);
    this.__controller = controller;

    this.__reconnectBtn = new qx.ui.toolbar.Button(this.tr("Reconnect"), 
      "icon/22/devices/network-wired.png");
    this.__reconnectBtn.setCommand(controller.getCommand("reconnect"));

    this.__reloadBtn = new qx.ui.toolbar.Button(this.tr("Refresh"), 
      "icon/22/actions/view-refresh.png");
    this.__reloadBtn.setCommand(controller.getCommand("reload"));

    // Add/Remove buttons
    this.__addBtn = new qx.ui.toolbar.Button(this.tr("Add"), 
      "icon/22/actions/list-add.png");
    this.__addBtn.setCommand(controller.getCommand("addTorrent"));

    this.__removeBtn = new qx.ui.toolbar.Button(this.tr("Remove"), 
      "icon/22/actions/list-remove.png");
    this.__removeBtn.setCommand(controller.getCommand("removeSelectedRows"));

    this.__startBtn = new qx.ui.toolbar.Button(this.tr("Start"), 
      "icon/22/actions/media-playback-start.png");
    this.__startBtn.setCommand(controller.getCommand("startSelectedRows"));

    this.__stopBtn = new qx.ui.toolbar.Button(this.tr("Pause"), 
      "icon/22/actions/media-playback-pause.png");
    this.__stopBtn.setCommand(controller.getCommand("stopSelectedRows"));

    this.__wishBtn = new qx.ui.toolbar.Button(this.tr("Wish files"), 
      "icon/22/actions/dialog-apply.png");
    this.__wishBtn.setCommand(controller.getCommand("wishSelectedFiles"));

    this.__peersView = new qx.ui.toolbar.RadioButton(this.tr("Peers"), 
      "icon/22/apps/preferences-users.png");
    this.__peersView.setUserData("value", "peers");

    this.__filesView = new qx.ui.toolbar.RadioButton(this.tr("Files"), 
      "icon/22/places/folder-open.png");
    this.__filesView.setUserData("value", "files");

    this.__wishesView = new qx.ui.toolbar.RadioButton(this.tr("Wishes"), 
      "icon/22/actions/view-sort-descending.png");
    this.__wishesView.setUserData("value", "wishlist");

    this.__logView = new qx.ui.toolbar.RadioButton(this.tr("Log"), 
      "icon/22/apps/utilities-log-viewer.png");
    this.__logView.setUserData("value", "log");


    this.add(this.__reconnectBtn);
    this.add(this.__reloadBtn);
    this.__spacer = this.addSpacer();
    this.add(this.__peersView);
    this.add(this.__filesView);
    this.add(this.__wishesView);
    this.add(this.__logView);

    this.__viewGroup = new qx.ui.form.RadioGroup;
    this.__viewGroup.setAllowEmptySelection(true);
    this.__viewGroup.add(this.__logView);
    this.__viewGroup.add(this.__filesView);
    this.__viewGroup.add(this.__wishesView);
    this.__viewGroup.add(this.__peersView);
    this.__viewGroup.addListener("changeSelection", controller.syncStackView, 
      controller);

    this.__addRadioCommand("showPeerView", this.__peersView);
    this.__addRadioCommand("showFileView", this.__filesView);
    this.__addRadioCommand("showWishView", this.__wishesView);
    this.__addRadioCommand("showLogView",  this.__logView);

    this.enableRowButtons(false);
    this.enableFileRowButtons(false);
    this.activate("torrent_table");
  },

  members :
  {
    __isRowButtonsEnabled : false,
    __isFileRowButtonsEnabled : false,


    __addRadioCommand : function(name, btn)
    {
      var cmd = this.__controller.getCommand(name);

      // The button will be pressed by the program.
      cmd.addListener("execute", 
        btn.toggleValue, 
        btn);

      btn.setToolTipText(cmd.getToolTipText());
    },
    /**
     * TODOC
     *
     * @param flag {Boolean} TODOC
     */
    __enableRowButtons : function(flag)
    {
      [ this.__removeBtn
      , this.__startBtn
      , this.__stopBtn 
      ].map(function(x) {
        x.setEnabled(flag);
      });
    },


    __enableFileRowButtons : function(flag)
    {
      [ this.__wishBtn
      ].map(function(x) {
        x.setEnabled(flag);
      });
    },


    /**
     * TODOC
     *
     * @param flag {Boolean} TODOC
     */
    enableRowButtons : function(flag)
    {
      this.__isRowButtonsEnabled = flag;
      this.__enableRowButtons(flag);
    },


    enableFileRowButtons : function(flag)
    {
      this.__isFileRowButtonsEnabled = flag;
      this.__enableFileRowButtons(flag);
    },


    /**
     * TODOC
     *
     * @param flag {Boolean} TODOC
     */
    setEnabled : function(flag)
    {
      [ this.__addBtn, this.__reloadBtn ].map(function(x) {
        x.setEnabled(flag);
      });

      if (flag == this.__isRowButtonsEnabled) 
        this.__enableRowButtons(flag);

      if (flag == this.__isFileRowButtonsEnabled) 
        this.__enableFileRowButtons(flag);
    },


    activate : function(name)
    {
      this.info("Activate " + name + " buttonset.");
      if (name == "torrent_table") {
        this.addBefore(this.__startBtn, this.__spacer);
        this.addBefore(this.__stopBtn, this.__spacer);
        return;
      }

      if (name == "file_tree") {
        this.addBefore(this.__wishBtn, this.__spacer);
        return;
      }
    },


    deactivate : function(name)
    {
      this.info("Deactivate " + name + " buttonset.");
      if (name == "torrent_table") {
        this.tryRemove(this.__startBtn);
        this.tryRemove(this.__stopBtn);
        return;
      }


      if (name == "file_tree") {
        this.tryRemove(this.__wishBtn);
        return;
      }
    },

    tryRemove : function(child)
    {
      if (this.indexOf(child) == -1)
        return;

      this.remove(child);
    }
  }
});
