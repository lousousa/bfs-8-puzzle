/*
	Version 1.0.4
*/

$(document).ready(function(){
	$(".bq-dropdown-menu").each(function(){
		var t = $($($(this).parent()).children()[0]).height();
		$(this).css("top",t);
	});
	var dropdown_id = 0;
	for(var i = 5; i <= 100; i += 5){
		$(".bq-dropdown-"+i).mouseover(function(){
			var h = 0;
			$($("#"+$(this).attr("id")+"-menu").children()).each(function(){
				h += $(this).height();
			});
			$("#"+$(this).attr("id")+"-menu").css({
				"height" : h
			});
		});
		$(".bq-dropdown-"+i).mouseleave(function(){
			$("#"+$(this).attr("id")+"-menu").css({
				"height" : 0
			});
		});
	}
});