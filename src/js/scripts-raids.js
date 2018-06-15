var raids = [];

$(document).ready(function() {
  importRaids();
});

function createCards() {
  var cardTemplate = $('#raidcard').clone();
  // $('#raidcard').remove();

  for (i = 0; i < raids.length; i++) {
    addNewCard(raids[i], i);
  }

  function addNewCard(data, id) {
    console.log(data, id);
    var newCard = $(cardTemplate).clone();
    $(newCard).attr('id', 'card_' + id);
    $(newCard).find('h2.header').html(data.location.name);
    $(newCard).find('img.gymImage').attr('src', ((data.location.img != 'null') ? data.location.img : '../images/newgyms.png'));
    $(newCard).find('span.lvlpokemon').html('Lvl' + data.raid.level + ': ' + data.raid.pokemon_id + ' - ' + data.raid.level + ': ');
    $(newCard).find('span.time').html('Time: ' + data.raid.start + ' &tilde; ' + data.raid.end);
    $('#raids').append($(newCard));
  }
}

function importRaids() {
  var jqxhrGyms = $.getJSON('../php/gyms.php', function(json) {
    $.each(json, function(i, item) {
      if (item.raid.active >= 1) {
        // console.log(i, item);
        raids.push(item);
      }
      //     var useIcon;
      //     var raidLevel = item.raid.level;
      //     switch (true) {
      //       case (raidLevel == 1):
      //         useIcon = raid1;
      //         break;
      //       case (raidLevel == 2):
      //         useIcon = raid2;
      //         break;
      //       case (raidLevel == 3):
      //         useIcon = raid3;
      //         break;
      //       case (raidLevel == 4):
      //         useIcon = raid4;
      //         break;
      //       case (raidLevel == 5):
      //         useIcon = raid5;
      //         break;
      //       default:
      //         useIcon = uncontested;
      //         break;
      //     }

      //     var locationPopupBody = '';
      //     var gmapsUrl = 'https://maps.google.com/maps?saddr=current+location&daddr=' + item.location.latitude + ',' + item.location.longitude + '&directionsmode=walking';
      //     var whatsappText = '';
      //     var whatsappUrl = '';

      //     if (!loginRequired || ((loginRequired) && (user.level > 0))) {
      //       if ((item.raid.level > 0) && (new Date().getTime() <= new Date(item.raid.spawn).getTime())) {
      //         if (item.raid.pokemon_id > 0) {
      //           locationPopupBody = '    <tr><th>Raid Info</th></tr>' +
      //             '    <tr><td>Lvl' + item.raid.level + ': ' + item.raid.pokemon_id + ' - ' + raidPokemonBosses[item.raid.level][item.raid.pokemon_id].name + '<br>Time: ' + item.raid.start.substring(0, 16) + ' &tilde; ' + item.raid.end.substring(11, 16) + '</td></tr>';
      //           whatsappText = 'Raid at: ' + item.location.name + ' (' + gmapsUrl + ')' + '\nTime: ' + item.raid.start.substring(0, 16) + ' ~ ' + item.raid.end.substring(11, 16);
      //         } else if (item.raid.pokemon_id <= 0) {
      //           locationPopupBody = '    <tr><th>Raid Info</th></tr>' +
      //             '    <tr><td>Lvl' + item.raid.level + ' ???<br> Spawn: ' + item.raid.spawn + '</td></tr>' +
      //             '    <tr><th>Add Raid Boss</th></tr>' +
      //             '    <tr><td style="text-align: center;"><img src="images/map-icons/choose-pokemon.png" class="eggie" data-location-id="' + i + '" data-toggle="modal" data-target="#choose-pokemon" data-raid-level="' + item.raid.level + '" data-raid-pokemonid="' + item.raid.pokemon_id + '" data-raid-spawn="' + item.raid.spawn + '" style="width:50px;" onclick="addRaid(this, ' + i + ', );" /></td></tr>';
      //           whatsappText = 'Gym: ' + item.location.name + ' (' + gmapsUrl + ')';
      //         } else {
      //           locationPopupBody = '    <tr><th>Register an Egg or Raid Boss</th></tr>' +
      //             '    <tr><td style="text-align: center;"><img src="images/map-icons/choose-egg.png" class="eggie" data-location-id="' + i + '" data-toggle="modal"  data-target="#choose-egg" style="width:50px;" onclick="addRaid(this, ' + i + ');" /><img src="images/map-icons/choose-pokemon.png" class="eggie" data-location-id="' + i + '" data-toggle="modal" data-target="#choose-pokemon" style="width:50px;" onclick="addRaid(this, ' + i + ');" /></td></tr>';
      //           whatsappText = 'Gym: ' + item.location.name + ' (' + gmapsUrl + ')';
      //         }
      //       } else if ((item.raid.level > 0) && (new Date().getTime() <= new Date(item.raid.end).getTime())) {
      //         if (item.raid.pokemon_id > 0) {
      //           locationPopupBody = '    <tr><th>Raid Info</th></tr>' +
      //             '    <tr><td>Lvl' + item.raid.level + ': ' + item.raid.pokemon_id + ' - ' + raidPokemonBosses[item.raid.level][item.raid.pokemon_id].name + '<br>Time: ' + item.raid.start.substring(0, 16) + ' &tilde; ' + item.raid.end.substring(11, 16) + '</td></tr>';
      //           whatsappText = 'Raid at: ' + item.location.name + ' (' + gmapsUrl + ')' + '\nTime: ' + item.raid.start.substring(0, 16) + ' ~ ' + item.raid.end.substring(11, 16);
      //         } else if (item.raid.pokemon_id <= 0) {
      //           locationPopupBody = '    <tr><th>Raid Info</th></tr>' +
      //             '    <tr><td>Lvl' + item.raid.level + ' ???<br>Time: ' + item.raid.start.substring(0, 16) + ' &tilde; ' + item.raid.end.substring(11, 16) + '</td></tr>' +
      //             '    <tr><th>Add Raid Boss</th></tr>' +
      //             '    <tr><td style="text-align: center;"><img src="images/map-icons/choose-pokemon.png" class="eggie" data-location-id="' + i + '" data-toggle="modal" data-target="#choose-pokemon" data-raid-level="' + item.raid.level + '" data-raid-pokemonid="' + item.raid.pokemon_id + '" data-raid-start="' + item.raid.start + '" data-raid-end="' + item.raid.end + '" style="width:50px;" onclick="addRaid(this, ' + i + ', );" /></td></tr>';
      //           whatsappText = 'Raid at: ' + item.location.name + ' (' + gmapsUrl + ')' + '\nTime: ' + item.raid.start.substring(0, 16) + ' ~ ' + item.raid.end.substring(11, 16);
      //         }
      //       } else {
      //         locationPopupBody = '    <tr><th>Register an Egg or Raid Boss</th></tr>' +
      //           '    <tr><td style="text-align: center;"><img src="images/map-icons/choose-egg.png" class="eggie" data-location-id="' + i + '" data-toggle="modal"  data-target="#choose-egg" style="width:50px;" onclick="addRaid(this, ' + i + ');" /><img src="images/map-icons/choose-pokemon.png" class="eggie" data-location-id="' + i + '" data-toggle="modal" data-target="#choose-pokemon" style="width:50px;" onclick="addRaid(this, ' + i + ');" /></td></tr>';
      //         whatsappText = 'Gym: ' + item.location.name + ' (' + gmapsUrl + ')';
      //       }
      //     }

      //     whatsappUrl = 'https://api.whatsapp.com/send?text=' + escape(whatsappText);

      //     var popupHtml = '<h2 class="fw700">' + item.location.name + '</h2>' +
      //       '<div class="mt4 mb4">' +
      //       '  <a href="' + whatsappUrl + '" rel="nofollow" target="_blank"><img src="images/map-icons/whatsapp.png" style="width:20px;" /></a>' +
      //       // '  <a class="ml10" href="" target="_blank"><img src="images/map-icons/twitter.png" style="width:20px;" /></a>' +
      //       '  <a class="ml10" href="' + gmapsUrl + '" target="_blank"><img src="images/map-icons/gmaps.png" style="width:20px;" /></a>' +
      //       '</div>' +
      //       '<div class="coordinate">Coordinate: ' + item.location.latitude + ', ' + item.location.longitude + '</div><br/>' +
      //       '<table class="w100 wiki_p4 mb4">' +
      //       '  <tbody>' +
      //       locationPopupBody +
      //       '  </tbody>' +
      //       '</table>';

      //     marker = new L.marker([item.location.latitude, item.location.longitude], {
      //         alt: i,
      //         title: item.location.name,
      //         icon: useIcon,
      //         virtual: true,
      //         id: i,
      //         raid: item.raid,
      //         lure_timer: '',
      //         titleDashed: '',
      //         pokemonId: item.raid.pokemon_id
      //       })
      //       .bindPopup(popupHtml, {
      //         minWidth: 180
      //       });
      //     markersArray.push(marker);
    });
  }).done(function(e) {
    // console.log('second success', e);
    createCards();
  }).fail(function(e) {
    console.log('error', e);
  }).always(function(e) {
    // console.log('complete', e);
  });
}

function countdowntimer(element, raidId, raidName, raidLevel, timestampSpawn, timestampStart, timestampEnd, pokemonId) {
  // var div = document.getElementById('tooltip' + raidId);
  // var now = new Date().getTime();
  // var countDownDate;
  // var time;

  // if ((now >= timestampStart) && (now <= timestampEnd)) {
  //   time = 'started';
  //   $('#tooltip' + raidId).parent().addClass('time-started');
  //   countDownDate = timestampEnd;

  //   element.setIcon(newDivIcon(raidLevel, pokemonId));
  // } else if (now <= timestampStart) {
  //   time = 'spawn';
  //   $('#tooltip' + raidId).parent().addClass('time-spawn');
  //   countDownDate = timestampStart;
  // } else {
  //   countDownDate = now;
  //   clearInterval(x);
  //   element.setIcon(uncontested).unbindTooltip();
  //   div.innerHTML = '';
  // }

  // var x = setInterval(function() {
  //   now = new Date().getTime();
  //   var distance = countDownDate - now;
  //   var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //   var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  //   div.innerHTML = minutes + ':' + ((seconds < 10) ? '0' + seconds : seconds);
  //   if ((distance < 0) && (time == 'spawn')) {
  //     countdowntimer(element, raidId, '', raidLevel, timestampSpawn, timestampStart, timestampEnd, pokemonId);
  //   } else if (distance < 0) {
  //     clearInterval(x);
  //     element.setIcon(uncontested).unbindTooltip();
  //     div.innerHTML = '';
  //   }
  // }, 1000);
}