
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

    this.__reconnectBtn = new qx.ui.toolbar.Button(this.tr("Reconnect"), 
        "icon/22/actions/view-refresh.png");
    this.__reconnectBtn.setCommand(controller.getCommand("reconnect"));
    this.add(this.__reconnectBtn);

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
    this.__startBtn.setCommand(controller.getCommand("startSelectedRows"));
    this.add(this.__startBtn);

    this.__stopBtn = new qx.ui.toolbar.Button(this.tr("Pause"), 
      "icon/22/actions/media-playback-pause.png");
    this.__stopBtn.setCommand(controller.getCommand("stopSelectedRows"));
    this.add(this.__stopBtn);

    this.enableRowButtons(false);
  },

  members :
  { 
    __isRowButtonsEnabled : true,
    __enableRowButtons: function(flag)
    {
      [ this.__removeBtn
      , this.__startBtn
      , this.__stopBtn
      ].map(function(x) {
        x.setEnabled(flag);
      });
    },
    enableRowButtons: function(flag)
    {
      this.__isRowButtonsEnabled = flag;
      this.__enableRowButtons(flag);
    },
    setEnabled: function(flag)
    {
      [ this.__addBtn
      , this.__reloadBtn
      ].map(function(x) {
        x.setEnabled(flag);
      });
      if (flag == this.__isRowButtonsEnabled)
        this.__enableRowButtons(flag);
    }
  }
});
