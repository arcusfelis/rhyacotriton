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
      "capacity"       : this.tr("Count"),
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
    
    var custom = {dataModel: new rhyacotriton.files.Model(this)};
    this.base(arguments, captions, custom);
    
    this.__n2p = n2p;
    this.__ids = ids;


    var tcm = this.getTableColumnModel();
    var rb = tcm.getBehavior();

    // Ensure that the tree column remains sufficiently wide
    rb.set(n2p.name,     { width:"1*", minWidth:180 });
    rb.set(n2p.size,     { width:"1*", minWidth:70, maxWidth:90  });
    rb.set(n2p.capacity, { width:"1*", minWidth:30, maxWidth:40  });
    rb.set(n2p.id,       { width:"1*", minWidth:30, maxWidth:40  });
    rb.set(n2p.progress, { width:"1*", minWidth:65, maxWidth:80  });

    [ n2p.capacity
    , n2p.id 
    ].map(function(id)
    {
      tcm.setColumnVisible(id, false);
    });

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

    this.addListener("treeOpenWithContent",
      this.onTreeOpen, this);

    this.addListener("treeClose",
      this.onTreeClose, this);

    store.addListener("fileDataLoadCompleted",
      this.onDataLoad, this);
    
    var msm = main.getSelectionModel();
    msm.addListener("changeSelection", this.refresh, this);
    
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
    __openSids : [],
    __dirSids : [],
    __active : false,

    _onKeyPress : function(e)
    {
      var code = e.getKeyIdentifier();
      if (code == "Escape") {
        var sm = this.getSelectionModel();
        sm.resetSelection();
      } else {
        this.base(arguments, e);
      }
    },
    

    addRows : function(tid, /*sid*/ parent_sid, rows)
    {
      var dm = this.getDataModel();
      var n2p = this.__n2p;
      var ids = this.__ids;

      var parent_nid = (parent_sid == 0) ? 0 : this.__sid2nid[parent_sid];


      for (var j = 0, nlen = rows.length; j<nlen; j++) {
        // extract node data array
        var row = rows[j];
        // get server id
        var sid = row[n2p.id];
        var name = row[n2p.name];

        // add a node to the tree
        if (typeof(this.__sid2nid[sid]) == 'undefined') {
          if (this.__isLeaf(sid)) {
            var nid = dm.addLeaf(parent_nid, name);
          } else {
            var is_empty = row.capacity == 0;
            var is_open = -1 != this.__openSids[tid].indexOf(sid);
            var nid = dm.addBranch(parent_nid, name, is_open, is_empty);
          }
        }
        // save indexes
        this.__nid2sid[nid] = sid;
        this.__sid2nid[sid] = nid;
        // set data for each data column
        for (var pos = 1, len = ids.length; pos<len; pos++) {
          dm.setColumnData(nid, pos, row[pos]);
        }
      }
    },

    __isLeaf : function(sid) {
      return -1 == this.__dirSids.indexOf(sid);
    },

    __clearState : function() {
      var tm = this.getDataModel();
      var sm = this.getSelectionModel();
      tm.clearData();
      sm.resetSelection();
      this.__nid2sid = {};
      this.__sid2nid = {};
      this.__dirSids = [];
    },


    setActive : function(bActive) {
      // is visable
      this.__active = bActive;
      if (bActive) 
        this.refresh();
    },


    /**
     * Node was closed 
     */
    onTreeOpenWhileEmpty : function(e)
    {
      var node = e.getData();
      var tid = this.__tid;
      var sid = this.__nid2sid[node.nodeId];
      this.__store.getFileTreeNode(tid, [sid]);
      this.onTreeOpen(e);
    },


    onTreeOpen : function(e)
    {
      var node = e.getData();
      var tid = this.__tid;
      var sid = this.__nid2sid[node.nodeId];
      this.__openSids[tid].push(sid);
      this.__openSids[tid] = this.__openSids[tid].sort();
    },


    /**
     * Node was opened 
     */
    onTreeClose : function(e)
    {
      var node = e.getData();
      var tid = this.__tid;
      var sid = this.__nid2sid[node.nodeId];
      qx.lang.Array.remove(this.__openSids[tid], sid);
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

      // Get table model
      var dm = this.getDataModel();

      // For each parent
      for (var plen = data.nodes.length, i = 0; i<plen; i++) 
      {
        // Relation is {parent_id, children}
        var rel = data.nodes[i];
        var rows = [];
        
        // For each child of the parent
        for (var j = 0, rlen = rel.children.length; j<rlen; j++) 
        {
          var child = rel.children[j];
          var sid = child.id;

          // save to the list of dirs
          if (child.is_leaf == false)
            this.__dirSids.push(sid);

          rows[j] = this.__mapToRow(child);
        }

        dm.sortRows(rows);

        // Add children to the model
        this.addRows(tid, rel.parent_id, rows); 
      }

      // update data in the table 
      dm.setData();
    },


    /* Map is from server */
    __mapToRow : function(map)
    {
      var row = [];
      var ids = this.__ids;

      for (var pos = 0, len = ids.length; pos<len; pos++) {
        var id = ids[pos];
        row[pos] = map[id];
      }
      return row;
    },


    /**
     * Fired, when selection in the main table was modified.
     */
    refresh : function()
    {
      if (!this.__active) return;

      var dm = this.getDataModel();

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
    },

    
    loadFileInfo : function()
    {
      var sids = this.getSelectedIds();
      if (sids.length) 
        this.__store.loadFileInfo(this.__tid, sids[0]);
    },

    sortHandler : function()
    {
      var dm = this.getDataModel();  
      this.updateData();
      dm.sortCompleted();               
    },

    updateData : function()
    {
      this.__clearState();
      var tid = this.__tid;
      if (typeof(this.__openSids[tid]) == "undefined") {
        this.__openSids[tid] = [0];
      }
      this.__store.getFileTreeNode(tid, this.__openSids[tid]);
    },

    setTorrentId : function(tid)
    {
      this.__tid = tid;
      this.updateData();
    }
  }
});
