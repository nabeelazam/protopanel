Object.extend(ProtoPanel, {
  setup: function(options) {
    document.panelManager = new ProtoPanel.Manager(options)
  },
  
  clobber: function() {
    document.panelManager = null;
  },
  
  // The ProtoPanel manager class is in charge of maintaining order.
  Manager: Class.create({
    // Sets up Panel manager, then binds it to document.
    initialize: function(options) {
      this.panels = new Array;
      this.addPanels(options);
      this.activate(this.activePanel());
    },
    
    // Grabs all panels, allowing custom selectors to be set.
    addPanels: function(options) {
      options = options || { };
      function add(element) {
        var panel = ProtoPanel.createPanel(element);
        if ( panel ) {
          this.panels.push(panel);
          // Check to see if default panel was specified
          if ( ('#' + document.URL.split('#')[1]) == panel.controlId ) { this.activate(panel); }
        }        
      };
      
      var tagName = options['tagName'] || 'div'; var className = options['className'] || 'panel';
      var parentSelector = options['parentSelector'] ? (options['parentSelector'] + ' ') : '';
      var targetSelector = parentSelector + tagName + '.' + className;
      $$(targetSelector).each(add.bind(this));
    },
    
    activePanel: function() {
      return this.panels.last();
    },

    activate: function(panel) {
      var panel = $(panel);
      this.panels.without(panel).invoke('hide');
      this.panels = this.panels.without(panel);
      this.panels.push(panel);
      panel.show();
    },
    
    goBack: function() {
      var panel = this.panels.pop();
      this.panels.unshift(panel);
      this.activate(this.activePanel());
    }
  })
});

Event.observe(document, 'dom:loaded', function() {
  Event.delegate(document, 'click', '._panelControl', ProtoPanel.Controls.click);
  $$('#back').invoke('observe', 'click', function(event) {
    document.panelManager.goBack();
    event.stop();
  })
})