qx.Class.define("rhyacotriton.files.Tree",
{
  extend : qx.ui.treevirtual.TreeVirtual,
  
  construct : function(store, /*table*/ main)
  {
    var n2c =
    {
      "name"           : this.tr("Name"),
      "id"             : this.tr("Id"),
      "size"           : this.tr("Size"),
      "progress"       : this.tr("Progress")
    };
    var n2p = {};
    var ids = [];
    var captions = [];

    var i = 0;
    for (var id in n2c) {
        n2p[id] = i;
        ids[i] = id;
        captions[i] = n2c[id];
        i++;
    }
    delete i;
    this.base(arguments, captions, {dataModel: new smart.model.TreeTable()});
    
    this.__n2p = n2p;
    this.__ids = ids;


    var tcm = this.getTableColumnModel();
    var rb = tcm.getBehavior();

    // Ensure that the tree column remains sufficiently wide
    rb.set(n2p.name,     { width:"1*", minWidth:180 });
    rb.set(n2p.size,     { width:"1*", minWidth:70, maxWidth:90  });
    rb.set(n2p.id,       { width:"1*", minWidth:30, maxWidth:40  });
    rb.set(n2p.progress, { width:"1*", minWidth:65, maxWidth:80  });


    tcm.setDataCellRenderer(n2p.size, new rhyacotriton.cellrenderer.Size());
    tcm.setDataCellRenderer(n2p.progress, 
        new rhyacotriton.cellrenderer.Progress());

    var sm = this.getSelectionModel();
    sm.setSelectionMode(qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION);

    this.__store = store;
    this.__mainTable = main;
    
    var dm = this.getDataModel();
    this.addListener("treeOpenWhileEmpty",
      this.onTreeOpenWhileEmpty, this);

    store.addListener("fileDataLoadCompleted",
      this.onDataLoad, this);
    
    var msm = main.getSelectionModel();
    msm.addListener("changeSelection", this.updateFilters, this);
    
    this.setAlwaysShowOpenCloseSymbol(true);
  },

  members : {
    __n2p : [],
    __ids : [],
    __nid2sid : {},
    __sid2nid : {},
    __tid : 0,
    __store : undefined,
    __mainTable : undefined,
    __oldSelection : [],
    

    addNodes : function(parent, nodes)
    {
      var dm = this.getDataModel();
      var n2p = this.__n2p;
      var ids = this.__ids;
      for (var j = 0, nlen = nodes.length; j<nlen; j++) {
        // extract node data array
        var node = nodes[j];
        // get server id
        var sid = node.id;
        // add a node to the tree
        if (typeof(this.__sid2nid[sid]) == 'undefined') {
          if (node.is_leaf) {
            var nid = dm.addLeaf(parent, node.name);
          } else {
            var is_empty = node.capacity == 0;
            var nid = dm.addBranch(parent, node.name, false, is_empty);
          }
        }
        // save indexes
        this.__nid2sid[nid] = sid;
        this.__sid2nid[sid] = nid;
        // set data for each data column
        for (var pos = 1, len = ids.length; pos<len; pos++) {
          var id = ids[pos];
          dm.setColumnData(nid, pos, node[id]);
        }
      }
      dm.setData();
    },


    __clearState : function() {
      var tm = this.getDataModel();
      var sm = this.getSelectionModel();
      tm.clearData();
      sm.resetSelection();
      this.__nid2sid = {};
      this.__sid2nid = {};
    },


    setActive : function(bActive) {
      // is visable
      this.__active = bActive;
    },


    onTreeOpenWhileEmpty : function(e)
    {
      this.info("Try load data");
      var node = e.getData();
      this.__store.getFileTreeNode(this.__tid, this.__nid2sid[node.nodeId]);
    },


    onDataLoad : function(e)
    {
      var data = e.getData();
      if (this.__tid != data.torrent_id)
        return;

      var parent = this.__sid2nid[data.parent];
      this.addNodes(parent, data.nodes); 
    },


    updateFilters : function(e)
    {
      var dm = this.getDataModel();

      var newSel = this.__mainTable.getSelectedIds();
      if (qx.lang.Array.equals(this.__oldSelection, newSel)) return;

      this.__oldSelection = qx.lang.Array.clone(newSel);
      this.info("change selection " + newSel);

      this.__clearState();
      if (newSel.length > 0) 
      {
        // get first
        this.__tid = newSel[0];
        this.__store.getFileTreeNode(this.__tid, 0);
      }
    },

    getSelectedIds : function()
    {
        var nodes = this.getSelectedNodes();
        var sids = [];
        for (var i = 0, nlen = nodes.length; i < nlen; i++) {
            var nid = nodes[i].nodeId;
            sids[i] = this.__nid2sid[nid];
        }
        return sids;
    },

    wishSelectedIds : function()
    {
        // Files' identificators on the server
        var sids = this.getSelectedIds();
        this.__store.wishSelectedFiles(this.__tid, sids);
    }
  }
});
