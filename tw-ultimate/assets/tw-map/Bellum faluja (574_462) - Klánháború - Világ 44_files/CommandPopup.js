var CommandPopup;!function(){"use strict";CommandPopup={command_sent_hooks:[],target_widget:null,openRallyPoint:function(o){return o=$.extend({ajax:"command"},o),TribalWars.get("place",o,function(o){Dialog.show("popup_command",o.dialog),$("#command-data-form").on("submit",CommandPopup.sendTroops),$("#command_change_sender").on("click",CommandPopup.SenderSelection.open)}),!1},sendTroops:function(){var o=$("#command-data-form").serializeArray();return o.push({name:CommandPopup.target_widget.clicked_button,value:"l"}),TribalWars.post("place",{ajax:"confirm"},o,function(o){Dialog.show("popup_command",o.dialog),$("#command-data-form").on("submit",CommandPopup.confirmSendTroops),$("#troop_confirm_back").on("click",CommandPopup.goBack)}),!1},confirmSendTroops:function(){var o=$("#command-data-form").serializeArray();return TribalWars.post("place",{ajaxaction:"popup_command"},o,function(o){Dialog.close(),UI.SuccessMessage(o.message);for(var n=0;n<CommandPopup.command_sent_hooks.length;n++)CommandPopup.command_sent_hooks[n](o)}),!1},goBack:function(){var o=$("#command-data-form").serializeArray(),n={};return $.each(o,function(o,a){n[a.name]=a.value}),CommandPopup.openRallyPoint(n),!1},hookCommandSent:function(o){this.command_sent_hooks.push(o)},SenderSelection:{open:function(){$("#command_target")[0]&&CommandPopup.target_widget.beforeSubmit();var o=$("#command-data-form").serializeArray();return o.push({name:CommandPopup.target_widget.clicked_button,value:"l"}),TribalWars.post("place",{ajax:"sender"},o,function(o){Dialog.show("popup_command",o.dialog),$("#command_sender_back").on("click",CommandPopup.goBack),$(".command_sender_choose").on("click",function(){return CommandPopup.SenderSelection.choose($(this).data("village"))}),$("#command_sender_group").on("change",CommandPopup.SenderSelection.open)}),!1},choose:function(o){return $("#command-data-form").find("input[name='source_village']").val(o),CommandPopup.goBack()},changeGroup:function(o){return CommandPopup.SenderSelection.open()}}}}();
