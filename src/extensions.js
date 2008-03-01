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

var HistoryBuddy = {
  lashHash: '',
  
  start: function() {
    HistoryBuddy.lastHash = HistoryBuddy.currentHash();
    new PeriodicalExecuter(HistoryBuddy.check, 0.2);
  },
  
  check: function(executer) {
    if ( HistoryBuddy.isNewHash() ) {
      var hash = HistoryBuddy.currentHash();
      document.panelManager.activate(hash);
      executer.stop();
      HistoryBuddy.start();
    }
  },
  
  currentHash: function() {
    return window.location.href.split('#')[1];
  },
  
  isNewHash: function() {
    return HistoryBuddy.lastHash != HistoryBuddy.currentHash();
  }
}

Event.observe(document, 'dom:loaded', function() {
  HistoryBuddy.start();  
})

