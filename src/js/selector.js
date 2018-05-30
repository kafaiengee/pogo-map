// $('.load_info img').on('click', function() {
// 	$("img",$(this).parents("div")).removeClass('selected');
// 	$(this).addClass('selected');

// 	var eq = $(this).index();
// 	$('.raidpokemon').addClass('collapse');
// 	$('.raidpokemon select').prop('required', false);


// 	$('.raidpokemon').eq(eq).removeClass('collapse');
// 	$('.raidpokemon select').eq(eq).prop('required', true);
// });


// $(document).on('click', function() {
	
// 	// console.log($('.eggie').attr('data-location-id'));
// 	// console.log($('.locationId').prop('value', data-location-id));
// 	// console.log("====end====")


// 	$('#gym_egg li').on('click', function() {
	
// 	$('#gym_egg li').removeClass('selected');
// 	$(this).addClass('selected');

// 	var lvNumber = $(this).attr('data-lv');
// 	console.log("====LV level====");
// 	console.log(lvNumber);
// 	console.log("====LV END====");
// 	$('.lv').prop('value', lvNumber);

// console.log("====test====")
// 	console.log($('.eggie').attr('data-location-id'));
// 	console.log("====end====")
// 	gymId = $('.eggie').attr('data-location-id');
// 	$('.locationId').prop('value', gymId);

//   $("button[type=submit]").removeAttr("disabled");
// });

// });


// // Register egg/pkmn or adding raidboss works
$(document).click(function() {
	$('.eggie').on('click', function() {
		console.log( $(this).attr('data-location-id'));
		$('.locationId').prop('value', $(this).attr('data-location-id'));
	});

	$('#gym_egg li').on('click', function() {
		$('#gym_egg li').removeClass('selected');
		$(this).addClass('selected');

		var lvNumber = $(this).attr('data-lv');
		$('.level').prop('value', lvNumber);


	  $("button[type=submit]").removeAttr("disabled");
	});
});


