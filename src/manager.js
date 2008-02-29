Object.extend(ProtoPanel, {
  setup: function(options) {
    document.panelManager = new ProtoPanel.Manager(options)
  },
  
  // The ProtoPanel manager class is in charge of maintaining order.
  Manager: Class.create({
    // Sets up Panel manager, then binds it to document.
    initialize: function(options) {
      this.panels = new Array;
      this.activePanel = null;
      this.addPanels(options);
    },
    
    // Grabs all panels, allowing custom selectors to be set.
    addPanels: function(options) {
      function add(element) {
        var panel = new ProtoPanel.Panel(element);
        this.panels.push(panel);
      };
      
      options = options || { };
      var tagName = options['tagName'] || 'div'; var className = options['className'] || 'panel';
      var parentSelector = options['parentSelector'] ? (options['parentSelector'] + ' ') : '';
      var targetSelector = parentSelector + tagName + '.' + className;
      $$(targetSelector).each(add.bind(this));
    }
  })
});
