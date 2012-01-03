
/* ************************************************************************

#asset(qx/icon/Tango/22/actions/list-add.png)
#asset(qx/icon/Tango/22/actions/list-remove.png)
#asset(qx/icon/Tango/22/actions/view-refresh.png)
#asset(qx/icon/Tango/22/actions/media-playback-start.png)
#asset(qx/icon/Tango/22/actions/media-playback-pause.png)

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
   * @param controller {feedreader.Application} The main application class
   */
  construct : function(controller)
  {
    this.base(arguments);

    this.__reloadBtn = new qx.ui.toolbar.Button(this.tr("Refresh"), 
        "icon/22/actions/view-refresh.png");
    this.__reloadBtn.setCommand(controller.getCommand("reload"));
    this.add(this.__reloadBtn);

    // Add/Remove buttons
    this.__addBtn = new qx.ui.toolbar.Button(this.tr("Add"), 
        "icon/22/actions/list-add.png");
    this.__addBtn.setCommand(controller.getCommand("addTorrent"));
    this.add(this.__addBtn);

    this.__removeBtn = new qx.ui.toolbar.Button(this.tr("Remove"), 
        "icon/22/actions/list-remove.png");
    this.__removeBtn.setCommand(controller.getCommand("removeSelectedRows"));
    this.add(this.__removeBtn);

    this.__startBtn = new qx.ui.toolbar.Button(this.tr("Start"), 
      "icon/22/actions/media-playback-start.png");
  //  this.__startBtn.setCommand(controller.getCommand("removeFeed"));
    this.add(this.__startBtn);

    this.__stopBtn = new qx.ui.toolbar.Button(this.tr("Stop"), 
      "icon/22/actions/media-playback-pause.png");
  //  this.__stopBtn.setCommand(controller.getCommand("removeFeed"));
    this.add(this.__stopBtn);

    this.enableRowButtons(false);
  },

  members :
  { 
    enableRowButtons: function(flag)
    {
      this.__removeBtn.setEnabled(flag);
      this.__startBtn.setEnabled(flag);
      this.__stopBtn.setEnabled(flag);
    }
  }
});
