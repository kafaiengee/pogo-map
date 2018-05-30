var pogomap,
  marker,
  markersArray = [],
  group,
  popup = L.popup(),
  dialog;

var uncontested, raid1, raid2, raid3, raid4, raid5, test;

$(document).ready(function() {
  L.Marker.addInitHook(function() {
    if (this.options.virtual) {
      // setup virtualization after marker was added
      this.on('add', function() {
        this._updateIconVisibility = function() {
          var map = this._map,
            isVisible = map.getBounds().contains(this.getLatLng()),
            wasVisible = this._wasVisible,
            icon = this._icon,
            iconParent = this._iconParent,
            shadow = this._shadow,
            shadowParent = this._shadowParent;

          // remember parent of icon 
          if (!iconParent) {
            iconParent = this._iconParent = icon.parentNode;
          }
          if (shadow && !shadowParent) {
            shadowParent = this._shadowParent = shadow.parentNode;
          }

          // add/remove from DOM on change
          if (isVisible != wasVisible) {
            if (isVisible) {
              iconParent.appendChild(icon);
              if (shadow) {
                shadowParent.appendChild(shadow);
              }
            } else {
              iconParent.removeChild(icon);
              if (shadow) {
                shadowParent.removeChild(shadow);
              }
            }
            this._wasVisible = isVisible;
          }
        };

        // on map size change, remove/add icon from/to DOM
        this._map.on('resize moveend zoomend', this._updateIconVisibility, this);
        this._updateIconVisibility();
      }, this);
    }
  });

  pogomap = L.map('mapid');
  pogomap.setView([52.379189, 4.899431], 15);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZHJhZ29uZHJhYWsiLCJhIjoiY2pnOWFtZjd4MDhybTJxbzVrdmMxaHRpNyJ9.6dUslZn7O2Md69_eZA1Q_A', {
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '',
    accessToken: 'pk.eyJ1IjoiZHJhZ29uZHJhYWsiLCJhIjoiY2pnOWFtZjd4MDhybTJxbzVrdmMxaHRpNyJ9.6dUslZn7O2Md69_eZA1Q_A',
    id: 'mapbox.streets'
  }).addTo(pogomap);

  uncontested = L.icon({
    iconUrl: 'images/map-icons/Uncontested.png',
    iconSize: [48, 48]
  });

  raid1 = L.icon({
    // iconUrl: 'images/map-icons/raid-lvl-1.png',
    iconUrl: 'images/map-icons/raidlv1.png',
    iconSize: [48, 48]
  });

  raid2 = L.icon({
    // iconUrl: 'images/map-icons/raid-lvl-2.png',
    iconUrl: 'images/map-icons/raidlv2.png',
    iconSize: [48, 48]
  });

  raid3 = L.icon({
    // iconUrl: 'images/map-icons/raid-lvl-3.png',
    iconUrl: 'images/map-icons/raidlv3.png',
    iconSize: [48, 48]
  });

  raid4 = L.icon({
    // iconUrl: 'images/map-icons/raid-lvl-4.png',
    iconUrl: 'images/map-icons/raidlv4.png',
    iconSize: [48, 48]
  });

  raid5 = L.icon({
    // iconUrl: 'images/map-icons/raid-lvl-5.png',
    iconUrl: 'images/map-icons/raidlv5.png',
    iconSize: [48, 48]
  });

  test = new L.DivIcon({
    className: 'egg',
    html: '<img class="egg" src="images/map-icons/raid.png" />' + '<span class="egg-text"></span>'
  });

  pogomap.on('load resize moveend zoomend', function() {
    // var markers = document.querySelectorAll('#mapid .leaflet-marker-pane *');
    // document.querySelector('#visible').innerText = markers.length;
  });

  var jqxhrGyms = $.getJSON('php/gyms.php', function(json) {
    $.each(json, function(i, item) {
      var useIcon;

      var raidLevel = item.raid.level;
      switch (true) {
        case (raidLevel == 1):
          useIcon = raid1;
          break;
        case (raidLevel == 2):
          useIcon = raid2;
          break;
        case (raidLevel == 3):
          useIcon = raid3;
          break;
        case (raidLevel == 4):
          useIcon = raid4;
          break;
        case (raidLevel == 5):
          useIcon = raid5;
          break;
        default:
          useIcon = uncontested;
          // useIcon = test;
          break;
      }

      console.log(i, item);
      // console.log("==test==");
      // console.log(i);
      // console.log('end');

      var popupHtml = '<h2 class="fw700">' + item.location.name + '</h2>' +
        '<div class="mt4 mb4">' +
        '  <a href="" onclick="window.open(this.href," rel="nofollow" target="_blank"><img src="images/map-icons/whatsapp.png" style="width:20px;" /></a>' +
        '  <a class="ml10" href="" target="_blank"><img src="images/map-icons/twitter.png" style="width:20px;" /></a>' +
        '  <a class="ml10" href="https://maps.google.com/maps?saddr=current+location&daddr=' + item.location.latitude + ',' + item.location.longitude + '&directionsmode=walking" target="_blank"><img src="images/map-icons/gmaps.png" style="width:20px;" /></a>' +
        '</div>' +
        '<div class="coordinate">Coordinate: ' + item.location.latitude + ', ' + item.location.longitude + '</div><br/>' +
        '<table class="w100 wiki_p4 mb4">' +
        '  <tbody>' +

        (((new Date().getTime() <= new Date(item.raid.end).getTime()) && (item.raid.level > 0) && (item.raid.pokemon_id > 0)) ?
          '    <tr><th>Raid Info</th></tr>' +
          '    <tr><td>Lvl' + item.raid.level + ' ' + item.raid.pokemon_id + '<br> Time: ' + item.raid.start.substring(0, 16) + ' &tilde; ' + item.raid.end.substring(11, 16) + '</td></tr>' +
          '' :
          ((new Date().getTime() <= new Date(item.raid.end).getTime()) && (item.raid.level > 0) && (new Date().getTime() >= new Date(item.raid.spawn).getTime())) ?
          '    <tr><th>Raid Info</th></tr>' +
          '    <tr><td>Lvl' + item.raid.level + ' ???<br> Time:' + item.raid.start.substring(0, 16) + ' &tilde; ' + item.raid.end.substring(11, 16) + '</td></tr>' +
          '    <tr><th>Add Raid Boss</th></tr>' +
          '    <tr><td style="text-align: center;"><img src="images/map-icons/choose-pokemon.png" class="eggie" data-location-id="' + i + '" data-toggle="modal" data-target="#choose-pokemon" data-raid-level="' + item.raid.level + '" data-raid-pokemonid="' + item.raid.pokemon_id + '" data-raid-start="' + item.raid.start + '" data-raid-end="' + item.raid.end + '" style="width:50px;" onclick="addRaid(this, ' + i + ', );" /></td></tr>' +
          '' :
          ((new Date().getTime() <= new Date(item.raid.end).getTime()) && (item.raid.level > 0) && (item.raid.pokemon_id === 0)) ?
          '    <tr><th>Raid Info</th></tr>' +
          '    <tr><td>Lvl' + item.raid.level + ' ???<br> Spawn: ' + item.raid.spawn + '</td></tr>' +
          '    <tr><th>Add Raid Boss</th></tr>' +
          '    <tr><td style="text-align: center;"><img src="images/map-icons/choose-pokemon.png" class="eggie" data-location-id="' + i + '" data-toggle="modal" data-target="#choose-pokemon" data-raid-level="' + item.raid.level + '" data-raid-pokemonid="' + item.raid.pokemon_id + '" data-raid-spawn="' + item.raid.spawn + '" style="width:50px;" onclick="addRaid(this, ' + i + ', );" /></td></tr>' +
          '' :
          '    <tr><th>Register an Egg or Raid Boss</th></tr>' +
          '    <tr><td style="text-align: center;"><img src="images/map-icons/choose-egg.png" class="eggie" data-location-id="' + i + '" data-toggle="modal"  data-target="#choose-egg" style="width:50px;" onclick="addRaid(this, ' + i + ');" /><img src="images/map-icons/choose-pokemon.png" class="eggie" data-location-id="' + i + '" data-toggle="modal" data-target="#choose-pokemon" style="width:50px;" onclick="addRaid(this, ' + i + ');" /></td></tr>') +

        '  </tbody>' +
        '</table>';

      marker = new L.marker([item.location.latitude, item.location.longitude], {
          alt: i,
          title: item.location.name,
          icon: useIcon,
          virtual: true,
          id: i,
          raid: item.raid,
          lure_timer: '',
          titleDashed: '',
          pokemonId: item.raid.pokemon_id
        })
        // .bindPopup('marker ' + i)
        .addTo(pogomap)
        .bindPopup(popupHtml, {
          // className: 'leaflet-popup-content-custom',
          minWidth: 180
        })
        /*.on('click', onMarkerClick)*/
      ;
      markersArray.push(marker);
    });
  }).done(function(e) {
    // console.log('second success', e);
    setInfo(e);
  }).fail(function(e) {
    console.log('error', e);
  }).always(function(e) {
    // console.log('complete', e);
    // console.log(markersArray);
    var group = new L.featureGroup(markersArray);
    // console.log(group);
    pogomap.fitBounds(group.getBounds());
  });


  var jqxhrRaids = $.getJSON('php/pokemon-raid.php', function(json) {
    raidPokemonBosses = json;
    // console.log(json);
  }).done(function(e) {
    // console.log('second success', e);
  }).fail(function(e) {
    // console.log('error', e);
  }).always(function(e) {
    // console.log('complete', e);
  });

  $('#choose-egg #gym_egg li').on('click', function(e) {
    $('#choose-egg #gym_egg li').removeClass('selected');
    $(this).addClass('selected');
    var lvNumber = $(this).attr('data-lv');
    $('#choose-egg .level').prop('value', lvNumber);
    $('#choose-egg #registerEgg').removeAttr('disabled');
  });

  $('#choose-pokemon #gym_egg li').on('click', function(e) {
    $('#choose-pokemon #gym_egg li').removeClass('selected');
    $(this).addClass('selected');
    var lvNumber = $(this).attr('data-lv');
    $('#choose-pokemon .level').prop('value', lvNumber);
    $('#choose-pokemon #registerPokemon').removeAttr('disabled');

    $('#choose-pokemon #gym_boss_list').html('');
    $.each(raidPokemonBosses[lvNumber], function(i, item) {
      $('#choose-pokemon #gym_boss_list').append('<li data-id="' + i + '" data-name="' + item.name + '"><img class="img-fluid" src="images/icons/' + i + '.png"></li>');
    });

    $('#choose-pokemon #gym_boss_list li').on('click', function(e) {
      $('#choose-pokemon #gym_boss_list li').removeClass('selected');
      $(this).addClass('selected');
      var pokemonId = $(this).attr('data-id');
      $('#choose-pokemon .pokemon_id').prop('value', pokemonId);
      $('#choose-pokemon #registerPokemon').removeAttr('disabled');
    });
  });

  $('#choose-egg-form').submit(function(event) {
    event.preventDefault();
    var data = $(this).serializeArray();
    var time = data[0].value;
    var locationId = data[1].value;
    var lvl = data[2].value;
    // console.log(time, locationId, lvl);

    var jqxhrAdd = $.post('php/raid-add.php', {
          raid: 'egg',
          spawn: time,
          locationId: locationId,
          level: lvl
        },
        function(e) {
          // console.log('success');
        })
      .done(function(e) {
        // console.log('second success');
      })
      .fail(function(e) {
        // console.log('error');
      })
      .always(function(e) {
        // console.log('finished');
      });
  });

  $('#choose-pokemon-form').submit(function(event) {
    event.preventDefault();
    var data = $(this).serializeArray();
    console.log(data);
    var minutes, timeStart, timeEnd, locationId, pokemonId, lvl;
    var postData = {};
    if (data[0].name == 'minutes') {
      minutes = data[0].value;
      locationId = data[1].value;
      pokemonId = data[2].value;
      lvl = data[3].value;

      postData = {
        raid: 'pokemon-add',
        minutes: minutes,
        locationId: locationId,
        pokemonId: pokemonId,
        level: lvl
      };
    } else {
      timeStart = data[0].value;
      timeEnd = data[1].value;
      locationId = data[2].value;
      pokemonId = data[3].value;
      lvl = data[4].value;

      postData = {
        raid: 'pokemon-update',
        start: timeStart,
        end: timeEnd,
        locationId: locationId,
        pokemonId: pokemonId,
        level: lvl
      };
    }

    var jqxhrAdd2 = $.post('php/raid-add.php', postData,
        function(e) {
          // console.log('success');
        })
      .done(function(e) {
        // console.log('second success');
      })
      .fail(function(e) {
        // console.log('error');
      })
      .always(function(e) {
        // console.log('finished');
      });
  });

  $("#choose-egg").on("hidden.bs.modal", function(e) {
    $('#choose-egg #eggTime').val('');
    $('#choose-egg #gym_egg li').removeClass('selected');
  });

  $("#choose-pokemon").on("hidden.bs.modal", function(e) {
    $('#choose-pokemon .form-group.1').html('<p>① Time minutes left:</p><input type="number" id="pokemonTime" name="minutes" min="1" max="45" placeholder="45" required>');
    $('#choose-pokemon #gym_egg li').removeClass('selected');
    $('#choose-pokemon #gym_boss_list').html('');
  });
});

function setInfo(e) {
  // Get todays date and time
  var now = new Date().getTime();

  for (var i = 0; i < markersArray.length; i++) {
    if (markersArray[i].options.raid.level > 0) {
      // Get date and time from element dataSets
      var timestampSpawn = new Date(markersArray[i].options.raid.spawn).getTime();
      var timestampStart = new Date(markersArray[i].options.raid.start).getTime();
      var timestampEnd = new Date(markersArray[i].options.raid.end).getTime();
      var raidId = markersArray[i].options.id;
      var raidName = markersArray[i].options.title;
      var raidLevel = markersArray[i].options.raid.level;
      var pokemonId = markersArray[i].options.raid.pokemon_id;

      // console.log(markersArray[i], timestampSpawn, timestampStart, timestampEnd, raidId, raidName);
      markersArray[i].bindTooltip('', {
          permanent: true,
          direction: 'bottom',
          className: 'leaflet-tooltip-bottom-custom'
        })
        .setTooltipContent('<div id="tooltip' + raidId + '" data-raid-id="' + raidId +
          '" data-raid-name="' + raidName + '">    </div>');
      // .setTooltipContent('<div id="tooltip' + raidId + '" data-raid-id="' + raidId + '" data-raid-name="' + raidName +
      //   '" data-timestamp-spawn="' + timestampSpawn + '" data-timestamp-start="' + timestampStart +
      //   '" data-timestamp-end="' + timestampEnd + '"></div>');

      countdowntimer(markersArray[i], raidId, raidName, raidLevel, timestampSpawn, timestampStart, timestampEnd, pokemonId);
    }
  }
}

function onMarkerClick(e) {
  // console.log(e);
  // popup
  //   .setLatLng(e.latlng)
  //   .setContent('You clicked the map at ' + e.latlng.toString())
  //   .openOn(pogomap);
  dialog
    .html(JSON.stringify(e.target.options))
    .dialog({
      title: e.target.options.title
    })
    .dialog('open');
}

function countdowntimer(element, raidId, raidName, raidLevel, timestampSpawn, timestampStart, timestampEnd, pokemonId) {
  var div = document.getElementById('tooltip' + raidId);
  var now = new Date().getTime();
  var countDownDate;

  if ((now >= timestampStart) && (now <= timestampEnd)) {
    var iconHTML;
    $('#tooltip' + raidId).parent().addClass('time-started');
    countDownDate = timestampEnd;

    if (pokemonId > 0) {
      iconHTML = '<img class="egg" src="images/map-icons/raid.png" />' +
        '<div class="egg-pokemon"><img class="pokemon-icon" src="images/icons/' + pokemonId + '.png" /></div>' +
        '<span class="egg-text">' + raidLevel + '</span>';
    } else {
      iconHTML = '<img class="egg" src="images/map-icons/raidlv0.png" />' +
        '<span class="egg-text">' + raidLevel + '</span>';
    }

    element.setIcon(new L.DivIcon({
      className: 'egg',
      html: iconHTML
    }));
  } else if (now <= timestampStart) {
    $('#tooltip' + raidId).parent().addClass('time-spawn');
    countDownDate = timestampStart;
  } else {
    countDownDate = now;
    clearInterval(x);
    element.setIcon(uncontested).unbindTooltip();
    div.innerHTML = '';
  }

  var x = setInterval(function() {
    now = new Date().getTime();
    var distance = countDownDate - now;
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    div.innerHTML = minutes + ':' + ((seconds < 10) ? '0' + seconds : seconds);
    if (distance < 0) {
      clearInterval(x);
      element.setIcon(uncontested).unbindTooltip();
      div.innerHTML = '';
    }
  }, 1000);
}

// Register egg/pkmn or adding raidboss works
function addRaid(e, id) {
  var locationId = e.dataset.locationId;
  var raidLevel = e.dataset.raidLevel;
  var raidPokemonid = e.dataset.raidPokemonid;
  var raidSpawn = e.dataset.raidSpawn;
  var raidStart = e.dataset.raidStart;
  var raidEnd = e.dataset.raidEnd;
  var target = e.dataset.target;
  // "2018-05-09 11:00:00"

  // console.log(e, e.dataset, id);

  $('.locationId').prop('value', id);

  if ((target == '#choose-pokemon') && (raidLevel !== undefined) && (raidPokemonid !== undefined) && (raidStart !== undefined) && (raidEnd !== undefined)) {
    $('#choose-pokemon .form-group.1').html('<p>① Raid Time:</p><p>' + raidStart.substring(0, 16) + ' &tilde; ' + raidEnd.substring(11, 16) + '</p><input type="hidden" id="starttime" name="starttime" value="' + raidStart + '"><input type="hidden" id="endtime" name="endtime" value="' + raidEnd + '">');
    $('#choose-pokemon #gym_egg li[data-lv=' + raidLevel + ']').addClass('selected');
    $('#choose-pokemon .level').val(raidLevel);

    $('#choose-pokemon #gym_boss_list').html('');
    $.each(raidPokemonBosses[raidLevel], function(i, item) {
      $('#choose-pokemon #gym_boss_list').append('<li data-id="' + i + '" data-name="' + item.name + '"><img class="img-fluid" src="images/icons/' + i + '.png"></li>');
    });

    $('#choose-pokemon #gym_boss_list li').on('click', function(e) {
      $('#choose-pokemon #gym_boss_list li').removeClass('selected');
      $(this).addClass('selected');
      var pokemonId = $(this).attr('data-id');
      $('#choose-pokemon .pokemon_id').prop('value', pokemonId);
      $('#choose-pokemon #registerPokemon').removeAttr('disabled');
    });
  } else if ((target == '#choose-pokemon') && (raidLevel !== undefined) && (raidPokemonid !== undefined) && (raidSpawn !== undefined)) {
    $('#choose-pokemon .form-group.1').html('<p>① Spawn Time:</p><p>' + raidSpawn + '</p><input type="hidden" id="starttime" name="starttime" value="' + raidSpawn + '">');
    $('#choose-pokemon #gym_egg li[data-lv=' + raidLevel + ']').addClass('selected');

    $('#choose-pokemon #gym_boss_list').html('');
    $.each(raidPokemonBosses[raidLevel], function(i, item) {
      $('#choose-pokemon #gym_boss_list').append('<li data-id="' + i + '" data-name="' + item.name + '"><img class="img-fluid" src="images/icons/' + i + '.png"></li>');
    });

    $('#choose-pokemon #gym_boss_list li').on('click', function(e) {
      $('#choose-pokemon #gym_boss_list li').removeClass('selected');
      $(this).addClass('selected');
      var pokemonId = $(this).attr('data-id');
      $('#choose-pokemon .pokemon_id').prop('value', pokemonId);
      $('#choose-pokemon #registerPokemon').removeAttr('disabled');
    });
  } else {
    $('#choose-pokemon .form-group.1').html('<p>① Time minutes left:</p><input type="number" id="pokemonTime" name="minutes" min="1" max="45" placeholder="45" required>');
  }
}

var raidPokemonBosses = {};