$('.load_info img').on('click', function() {
	$("img",$(this).parents("div")).removeClass('selected');
	$(this).addClass('selected');

	var eq = $(this).index();
	$('.raidpokemon').addClass('collapse');
	$('.raidpokemon select').prop('required', false);


	$('.raidpokemon').eq(eq).removeClass('collapse');
	$('.raidpokemon select').eq(eq).prop('required', true);
});



$('#gym_egg li').on('click', function() {
	$('#gym_egg li').removeClass('selected');
	$(this).addClass('selected');

	var lvNumber = $(this).attr('data-lv');
	console.log(lvNumber);
	$('.lv').prop('value', lvNumber);

  $("button[type=submit]").removeAttr("disabled");
});
