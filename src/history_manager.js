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

