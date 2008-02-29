Object.extend(ProtoPanel, {
  Panel: Class.create({
    initialize: function(element) {
      this.element = $(element);
      Object.extend(this.element, ProtoPanel.Extensions);
    }
  })
});
