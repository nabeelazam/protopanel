<%= include 'HEADER' %>

var ProtoPanel = {
  Version: '<%= PROTOPANEL_VERSION %>'
}

<%= include 'extensions.js', 'controls.js', 'panel.js', 'manager.js', 'history_manager.js' %>
