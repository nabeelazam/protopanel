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

// Introduces Event delegation (http://icant.co.uk/sandbox/eventdelegation)
Object.extend(Event, (function(){
  return {
    delegate: function(element, eventName, targetSelector, handler) {
      var element = $(element);
      function createDelegation(_delegatedEvent) {
        var origin = _delegatedEvent.element();
        if ( origin.match(targetSelector) && (typeof handler == 'function') ){ return handler(_delegatedEvent); }
      };
      element.observe(eventName, createDelegation);
      return element;
    },

    delegators: function(element, eventName, rules) {
      var element = $(element);
      function delegateRule(rule) {
        element.delegate(eventName, rule.key, rule.value)
      }
      $H(rules).each(delegateRule)
      return element;
    }
  }
})())

Element.addMethods({
  delegate: Event.delegate,
  delegators: Event.delegators
})

Object.extend(document, {
  delegate: Event.delegate,
  delegators: Event.delegators
})


// Element extensions for Panels
Object.extend(ProtoPanel, {
  Extensions: {
    activate: function(element) {
      var element = $(element);
      if ( !document.panelManager.panels.include(element) ) { return false; }
      document.panelManager.activate(element);
      return element;
    },

    isActive: function(element) {
      var element = $(element);
      if ( !document.panelManager.panels.include(element) ) { return false; }
      return (document.panelManager.activePanel() === element);
    }
  }
});

Element.addMethods(ProtoPanel.Extensions);

Object.extend(ProtoPanel, {
  Controls: {
    click: function(event) {
      var element = event.element();
      var targetId = element.readAttribute('href').gsub('#', '');
      $(targetId).activate();
    }
  }
});

Object.extend(ProtoPanel, {
  createPanel: function(element){
    var element = $(element);
    if ( element == null ) { return };
    var controlId = '#' + element.identify();
    var control = $$('a').detect(function(link) { return link.readAttribute('href') == controlId });
    if ( control != null ) {
      control.addClassName('_panelControl');
      element.controlId = controlId;
      return element;
    } else { return false; }
  }
});

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

// Allows anchor-based navigation (including back-button compatibility)
// by using a PeriodicalExecuter to check the URL's hash component against
// a cached version. If there's a difference, the active panel is updated
// using the new URL hash component.
var HistoryManager = {
  lastHash: '',

  start: function() {
    HistoryManager.lastHash = HistoryManager.currentHash();
    new PeriodicalExecuter(HistoryManager.check, 0.2);
  },

  check: function(executer) {
    if ( HistoryManager.isNewHash() ) {
      var hash = HistoryManager.currentHash();
      document.panelManager.activate(hash);
      executer.stop();
      HistoryManager.start();
    }
  },

  currentHash: function() {
    return window.location.href.split('#')[1];
  },

  isNewHash: function() {
    return HistoryManager.lastHash != HistoryManager.currentHash();
  }
}

Event.observe(document, 'dom:loaded', function() {
  HistoryManager.start();
})
