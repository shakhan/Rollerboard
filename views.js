var Views = {}

$.each(["message"], function() {
	var view_name = this;
	
	$.ajax({
		url: this + '.mustache',
		success:function(view) {
			Views[view_name] = view;
		},
		error:function() {
			alert("Couldn't load view '" + view_name + "'.");
		},
		async:false
	});
});
