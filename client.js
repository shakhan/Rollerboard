/* 
   On window load, add enter key handler for the textbox 
   and subsequently retrieve the top 10 messages 
*/
$(window).load(function() {
	$("#message").keypress( function(e) {
		if (e.keyCode != 13) return;
		var message = $("#message").attr("value").replace("\n", "");
		sendMessage(message);
	});	
	getMessages();
});

/* Render the data recieved from the server */
function renderServerData(data, f) {
	if(data && data.message) {
		var x = eval(data.message);
		var group = $('<div class="message_group"></div>');
		for(var i=0; i<x.length; i++) {
			var json = { 
				'msg'   : x[i],
				'klaaz' : 'style-the-message'
			};
			var html = Mustache.to_html(Views.message, json);
			group.append(html);
		}
		f(group);
	} else {
		$("#stream").html("No messages to display!");
	}
}

/* Get messages if any from the server on page load */
function getMessages() {
        jQuery.get("/get_messages",
                        {},
                        function (data) {
				renderServerData(data, function(html) {
					$('#stream').prepend(html);
				});
                        },
                        "json"
        );
}

/* Send a message to the server and also retrieve the top 10 messages */
function sendMessage(message) {
	jQuery.get("/send_message",
			{ message: message },
			function (data) {
				$("#message").attr("value", ""); // clear the message field
				renderServerData(data, function(html) {
					$('#stream').html(html);
				});
			}, 
			"json"
	);
}
