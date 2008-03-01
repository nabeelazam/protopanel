Object.extend(ProtoPanel, {
  Controls: {
    click: function(event) {
      var element = event.element();
      var targetId = element.readAttribute('href').gsub('#', '');
      $(targetId).activate();
    }
  }
});
