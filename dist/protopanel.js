/*  Protopanel Javascript Library, version 0.0.1
 *  (c) 2008 Pat Nakajima
 *
 *  Protopanel is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/


var ProtoPanel = {
  Version: '0.0.1'
}

Object.extend(ProtoPanel, {
  Extensions: {
    activate: function() {

    }
  }
});

Object.extend(ProtoPanel, {
  Panel: Class.create({
    initialize: function(element) {
      this.element = $(element);
      Object.extend(this.element, ProtoPanel.Extensions);
    }
  })
});

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
