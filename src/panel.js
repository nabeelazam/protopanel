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
