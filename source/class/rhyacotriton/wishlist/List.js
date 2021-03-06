qx.Class.define("rhyacotriton.wishlist.List",
{
  extend : qx.ui.form.List,
  
  construct : function(container, store, /*table*/ main)
  {
    this.base(arguments);
    this.__store = store;
    this.__mainTable = main;

    this.setDraggable(true);
    this.setDroppable(true);
    this.setSelectionMode("multi");

    // Create drag indicator
    var indicator = this.__indicator = this.__createIndicator();    
    container.getRoot().add(indicator);

    // Just add a move action
    this.addListener("dragstart", this.__onDragStart, this);
    this.addListener("dragend", this.__onDragEnd, this);
    this.addListener("drag", this.__onDrag, this);
    this.addListener("dragover", this.__onDragOver, this);
    this.addListener("drop", this.__onDrop, this);

    indicator.addListener("drop", function(e) {
      this.__reorderList(this.__currentListItem);
      this.saveData();
    }, this);

    var msm = main.getSelectionModel();
    msm.addListener("changeSelection", this.refresh, this);

    store.addListener("wishDataLoadCompleted",
      this.onDataLoad, this);
  },

  members : {
    __active : false,
    __oldList : [],

    _onKeyPress : function(e)
    {
      var code = e.getKeyIdentifier();
      if (code == "Delete") {
        this.removeSelected();
        this.saveData();
      } else 
      if (code == "Escape") {
        this.resetSelection();
      } else {
        this.base(arguments, e);
      }
    },

    removeSelected : function()
    {
      var items = this.getSelection();
      for (var i = 0, len = items.length; i<len; i++)
        this.remove(items[i]);
    },


    /**
     * Data was loaded from the server
     */
    onDataLoad : function(e)
    {
      var data = e.getData();
      var tid = data.torrent_id;  

      if (this.__tid != tid)
        return;

      var newList = [];

      // Clear the list.
      this.removeAll();

      for (var i=0, len = data.list.length; i<len; i++) {
        // Wish is {name, value}.
        var wish = data.list[i];

        // Choose an icon
        var icon = wish.value instanceof Array
          ? "icon/16/places/folder.png"
          : "icon/16/mimetypes/office-document.png";

        var name = wish.name;
        var item = new qx.ui.form.ListItem(name, icon);

        // Add tag with the proplist
        item.rawData = wish;

        // Save the current value
        newList[i] = wish.value;

        // Add to the end of the list
        this.add(item);
      }

      this.__oldList = newList;
    },


    __createIndicator : function()
    {
      var indicator = new qx.ui.core.Widget;
      indicator.setDecorator(new qx.ui.decoration.Single().set({
        top : [ 1, "solid", "#33508D" ]
      }));
      indicator.setHeight(0);
      indicator.setOpacity(0.5);
      indicator.setZIndex(100);
      indicator.setLayoutProperties({left: -1000, top: -1000});
      indicator.setDroppable(true);

      return indicator;
    },

    __reorderList : function(listItem)
    {
      var sel = this.getSortedSelection();

      // Only continue if the target is a list item.
      if (listItem.classname == "qx.ui.form.ListItem") 
      {
        for (var i=0, l=sel.length; i<l; i++)
        {
          this.addBefore(sel[i], listItem);

          // recover selection as it get lost during child move
          this.addToSelection(sel[i]);
        }
      } 
      // Add to the end of the list
      else 
      {
        for (var i=0, l=sel.length; i<l; i++)
        {
          this.add(sel[i]);

          // recover selection as it get lost during child move
          this.addToSelection(sel[i]);
        }
      }
    },

    __onDragStart : function(e) 
    {
      e.addAction("move");
    },

    __onDragEnd : function(e)
    {
      // Move indicator away
      this.__indicator.setDomPosition(-1000, -1000);
    },

    __onDrag : function(e)
    {
      var orig = e.getOriginalTarget();
      var indicator = this.__indicator;

      // store the current listitem - if the user drops on the indicator
      // we can use this item instead of calculating the position of the
      // indicator
      if (orig instanceof qx.ui.form.ListItem) {
        qx.core.Init.getApplication().__currentListItem = orig;
      }

      if (!qx.ui.core.Widget.contains(this, orig) && orig != indicator) {
        return;
      }

      var origCoords = orig.getContainerLocation();

      indicator.setWidth(orig.getBounds().width);
      indicator.setDomPosition(origCoords.left, origCoords.top);
    },

    __onDragOver : function(e)
    {
      // Stop when the dragging comes from outside
      if (e.getRelatedTarget()) {
        e.preventDefault();
      }
    },

    __onDrop : function(e)
    {
      this.__reorderList(e.getOriginalTarget());
      this.saveData();
    },


    __oldSelection : [],

    /**
     * Fired, when selection in the main table was modified.
     */
    refresh : function()
    {
      if (!this.__active) return;

      var newSel = this.__mainTable.getSelectedIds();
      if (qx.lang.Array.equals(this.__oldSelection, newSel)) return;

      this.__oldSelection = qx.lang.Array.clone(newSel);
      this.info("change selection " + newSel);

      if (newSel.length > 0) 
      {
        // get first
        this.setTorrentId(newSel[0]);
      }
    },

    setTorrentId : function(tid)
    {
      this.__tid = tid;
      this.updateData();
    },

    setActive : function(bActive) 
    {
      // is visable
      this.__active = bActive;
      if (bActive) 
        this.refresh();
    },

    /* Load new data from the server */
    updateData : function()
    {
      this.removeAll();
      this.__store.getWishes(this.__tid);
    },

    // Get data for sending on a server
    __getList : function()
    {
      var items = this.getChildren();
      var acc = [];
      for (var i = 0, len = items.length; i<len; i++) {
        acc[i] = items[i].rawData;
      }
      this.info("Save list: " + acc);
      return acc;
    },

    saveData : function()
    {
      var newList = this.__getList(); 
      // Nothing was changed.
      if (newList == this.__oldList) return;
      this.__oldList = newList;
      this.__store.setWishes(this.__tid, newList);
    }
  }
});

