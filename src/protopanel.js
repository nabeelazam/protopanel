<%= include 'HEADER' %>

var ProtoPanel = {
  Version: '<%= PROTOPANEL_VERSION %>'
}

<%= include 'extensions.js', 'panel.js', 'manager.js' %>