var pogomap,
  lastZoom,
  marker,
  markersArray = [],
  overlayMaps = {},
  layerTooltips,
  layerGyms,
  layerStops,
  layerNests,
  groupGyms,
  popup = L.popup(),
  dialog;
var useMyLocation = true,
  pin, circle;
var uncontested, raid1, raid2, raid3, raid4, raid5, test;
var raidPokemonBosses = {};
var loginRequired = false;

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
    maxZoom: 17,
    attribution: '',
    accessToken: 'pk.eyJ1IjoiZHJhZ29uZHJhYWsiLCJhIjoiY2pnOWFtZjd4MDhybTJxbzVrdmMxaHRpNyJ9.6dUslZn7O2Md69_eZA1Q_A',
    id: 'mapbox.streets'
  }).addTo(pogomap);

  pogomap.zoomControl.setPosition('bottomright');

  pogomap.locate({
    enableHighAccuracy: true,
    maxZoom: 17,
    setView: true
  });

  pogomap.on('load resize moveend zoomend', function() {});

  pogomap.on('zoomend', onZoomEnd);

  function onZoomEnd() {
    var zoom = pogomap.getZoom();
    if (zoom < 15 && (!lastZoom || lastZoom >= 15)) {
      pogomap.eachLayer(function(l) {
        if (l.getTooltip) {
          var toolTip = l.getTooltip();
          if (toolTip) {
            toolTip._contentNode.style.visibility = 'hidden';
          }
        }
      });
    } else if (zoom >= 15 && (!lastZoom || lastZoom < 15)) {
      pogomap.eachLayer(function(l) {
        if (l.getTooltip) {
          var toolTip = l.getTooltip();
          if (toolTip) {
            toolTip._contentNode.style.visibility = 'visible';
          }
        }
      });
    }
    lastZoom = zoom;
  }

  pogomap.on('locationfound', onLocationFound);
  pogomap.on('locationerror', onLocationError);

  function onLocationFound(e) {
    useMyLocation = true;
    var radius = e.accuracy / 2;
    if (pogomap.hasLayer(pin)) {
      pogomap.removeLayer(pin);
    }
    pin = L.marker(e.latlng).bindPopup("You are within " + radius + " meters from this point").openPopup();
    pogomap.addLayer(pin);

    if (pogomap.hasLayer(circle)) {
      pogomap.removeLayer(circle);
    }
    circle = L.circle(e.latlng, radius).addTo(pogomap);
    pogomap.addLayer(circle);

    pogomap.locate({
      enableHighAccuracy: true,
      maxZoom: 17,
      setView: true
    });
  }

  function onLocationError(e) {
    console.log(e.message);
  }

  var customControls = L.Control.extend({
    options: {
      position: 'topright' //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
    },
    onAdd: function(pogomap) {
      var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      container.style.backgroundColor = 'white';
      var myLocation = L.DomUtil.create('div', 'custom-controls myLocation');
      myLocation.onclick = function() {
        $(this).toggleClass('disabled');
        if (useMyLocation) {
          useMyLocation = false;
          pogomap.stopLocate();
        } else {
          useMyLocation = true;
          pogomap.locate({
            enableHighAccuracy: true,
            maxZoom: 17,
            setView: true
          });
        }
      };
      var gyms = L.DomUtil.create('div', 'custom-controls raids');
      gyms.onclick = function() {
        $(this).toggleClass('disabled');
        if (pogomap.hasLayer(layerGyms)) {
          pogomap.removeLayer(layerGyms);
        } else {
          pogomap.addLayer(layerGyms);
        }
      };
      var stops = L.DomUtil.create('div', 'custom-controls stops');
      stops.onclick = function() {
        $(this).toggleClass('disabled');
        if (pogomap.hasLayer(layerStops)) {
          pogomap.removeLayer(layerStops);
        } else {
          pogomap.addLayer(layerStops);
        }
      };
      var nests = L.DomUtil.create('div', 'custom-controls nests');
      nests.onclick = function() {
        $(this).toggleClass('disabled');
        if (pogomap.hasLayer(layerNests)) {
          pogomap.removeLayer(layerNests);
        } else {
          pogomap.addLayer(layerNests);
        }
      };

      container.appendChild(myLocation);
      // container.appendChild(gyms);
      // container.appendChild(stops);
      // container.appendChild(nests);
      return container;
    }
  });

  pogomap.addControl(new customControls());

  // layerNests = new L.geoJson(amsParks);
  // pogomap.addLayer(layerNests);

  uncontested = L.icon({
    iconUrl: 'images/map-icons/Uncontested.svg',
    iconSize: [24, 24]
  });

  raid1 = L.icon({
    iconUrl: 'images/map-icons/raidlv1.png',
    iconSize: [24, 24]
  });

  raid2 = L.icon({
    iconUrl: 'images/map-icons/raidlv2.png',
    iconSize: [24, 24]
  });

  raid3 = L.icon({
    iconUrl: 'images/map-icons/raidlv3.png',
    iconSize: [24, 24]
  });

  raid4 = L.icon({
    iconUrl: 'images/map-icons/raidlv4.png',
    iconSize: [24, 24]
  });

  raid5 = L.icon({
    iconUrl: 'images/map-icons/raidlv5.png',
    iconSize: [24, 24]
  });

  importGyms();

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
      if (Object.keys(raidPokemonBosses[lvNumber]).length <= 1) {
        $('#choose-pokemon #gym_boss_list').append('<li data-id="' + i + '" data-name="' + item.name + '" class="selected"><img class="img-fluid" src="images/icons/' + i + '.png"></li>');
      } else {
        $('#choose-pokemon #gym_boss_list').append('<li data-id="' + i + '" data-name="' + item.name + '"><img class="img-fluid" src="images/icons/' + i + '.png"></li>');
      }
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
    var pokemonId = '0';

    if (Object.keys(raidPokemonBosses[lvl]).length <= 1) {
      pokemonId = Object.keys(raidPokemonBosses[lvl])[0];
    }

    var postData = {
      raid: 'egg',
      spawn: time,
      locationId: locationId,
      pokemonId: pokemonId,
      level: lvl,
      user: user.username
    };

    var jqxhrAdd = $.post('php/raid-add.php', postData,
        function(e) {
          // console.log('success');
        })
      .done(function(e) {
        // console.log('second success');
        $('#choose-egg').modal('toggle');

        setTimeout(function(e) {
          updateGym(locationId);
        }, 200);
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
    var minutes, timeStart, timeEnd, locationId, pokemonId, lvl;
    var postData = {};

    if (data[0].name == 'minutes') {
      minutes = data[0].value;
      locationId = data[1].value;
      if (Object.keys(raidPokemonBosses[data[3].value]).length <= 1) {
        pokemonId = Object.keys(raidPokemonBosses[data[3].value])[0];
      } else {
        pokemonId = data[2].value;
      }
      lvl = data[3].value;

      postData = {
        raid: 'pokemon-add',
        minutes: minutes,
        locationId: locationId,
        pokemonId: pokemonId,
        level: lvl,
        user: user.username
      };
    } else if (data[0].name == 'starttime') {
      timeStart = data[0].value;
      timeEnd = data[1].value;
      locationId = data[2].value;
      if (Object.keys(raidPokemonBosses[data[4].value]).length <= 1) {
        pokemonId = Object.keys(raidPokemonBosses[data[4].value])[0];
      } else {
        pokemonId = data[3].value;
      }
      lvl = data[4].value;

      postData = {
        raid: 'pokemon-update',
        start: timeStart,
        end: timeEnd,
        locationId: locationId,
        pokemonId: pokemonId,
        level: lvl,
        user: user.username
      };
    } else {
      timeSpawn = data[0].value;
      locationId = data[1].value;
      if (Object.keys(raidPokemonBosses[data[3].value]).length <= 1) {
        pokemonId = Object.keys(raidPokemonBosses[data[3].value])[0];
      } else {
        pokemonId = data[2].value;
      }
      lvl = data[3].value;

      postData = {
        raid: 'pokemon-update',
        spawn: timeSpawn,
        locationId: locationId,
        pokemonId: pokemonId,
        level: lvl,
        user: user.username
      };
    }

    var jqxhrAdd2 = $.post('php/raid-add.php', postData,
        function(e) {
          // console.log('success');
        })
      .done(function(e) {
        // console.log('second success');
        $('#choose-pokemon').modal('toggle');

        setTimeout(function(e) {
          updateGym(locationId);
        }, 200);
      })
      .fail(function(e) {
        // console.log('error');
      })
      .always(function(e) {
        // console.log('finished');
      });
  });

  $('#choose-egg').on('hidden.bs.modal', function(e) {
    $('#choose-egg #eggTime').val('');
    $('#choose-egg #gym_egg li').removeClass('selected');
  });

  $('#choose-pokemon').on('hidden.bs.modal', function(e) {
    $('#choose-pokemon .form-group.1').html('<p>① Time minutes left:</p><input type="number" class="inputSmallBar" id="pokemonTime" name="minutes" min="1" max="45" placeholder="45" required>');
    $('#choose-pokemon #gym_egg li').removeClass('selected');
    $('#choose-pokemon #gym_boss_list').html('');
  });

  $('#topnav').click(function() {
    $(this).toggleClass('change');
  });
});

function importGyms(id) {
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
          break;
      }

      var locationPopupBody = '';
      var gmapsUrl = 'https://maps.google.com/maps?saddr=current+location&daddr=' + item.location.latitude + ',' + item.location.longitude + '&directionsmode=walking';
      var whatsappText = '';
      var whatsappUrl = '';

      if (!loginRequired || ((loginRequired) && (user.level > 0))) {
        if ((item.raid.level > 0) && (new Date().getTime() <= (new Date(item.raid.spawn.split(' ').join('T') + 'Z').getTime() - 7200000))) {
          if (item.raid.pokemon_id > 0) {
            locationPopupBody = '    <tr><th>Raid Info</th></tr>' +
              '    <tr><td>Lvl' + item.raid.level + ': ' + item.raid.pokemon_id + ' - ' + raidPokemonBosses[item.raid.level][item.raid.pokemon_id].name + '<br>Time: ' + item.raid.start.substring(0, 16) + ' &tilde; ' + item.raid.end.substring(11, 16) + '</td></tr>';
            whatsappText = 'Raid at: ' + item.location.name + ' (' + gmapsUrl + ')' + '\nTime: ' + item.raid.start.substring(0, 16) + ' ~ ' + item.raid.end.substring(11, 16);
          } else if (item.raid.pokemon_id <= 0) {
            locationPopupBody = '    <tr><th>Raid Info</th></tr>' +
              '    <tr><td>Lvl' + item.raid.level + ' ???<br> Spawn: ' + item.raid.spawn + '</td></tr>' +
              '    <tr><th>Add Raid Boss</th></tr>' +
              '    <tr><td style="text-align: center;"><img src="images/map-icons/choose-pokemon.png" class="eggie" data-location-id="' + i + '" data-toggle="modal" data-target="#choose-pokemon" data-raid-level="' + item.raid.level + '" data-raid-pokemonid="' + item.raid.pokemon_id + '" data-raid-spawn="' + item.raid.spawn + '" style="width:50px;" onclick="addRaid(this, ' + i + ', );" /></td></tr>';
            whatsappText = 'Gym: ' + item.location.name + ' (' + gmapsUrl + ')';
          } else {
            locationPopupBody = '    <tr><th>Register an Egg or Raid Boss</th></tr>' +
              '    <tr><td style="text-align: center;"><img src="images/map-icons/choose-egg.png" class="eggie" data-location-id="' + i + '" data-toggle="modal"  data-target="#choose-egg" style="width:50px;" onclick="addRaid(this, ' + i + ');" /><img src="images/map-icons/choose-pokemon.png" class="eggie" data-location-id="' + i + '" data-toggle="modal" data-target="#choose-pokemon" style="width:50px;" onclick="addRaid(this, ' + i + ');" /></td></tr>';
            whatsappText = 'Gym: ' + item.location.name + ' (' + gmapsUrl + ')';
          }
        } else if ((item.raid.level > 0) && (new Date().getTime() <= (new Date(item.raid.end.split(' ').join('T') + 'Z').getTime() - 7200000))) {
          if (item.raid.pokemon_id > 0) {
            locationPopupBody = '    <tr><th>Raid Info</th></tr>' +
              '    <tr><td>Lvl' + item.raid.level + ': ' + item.raid.pokemon_id + ' - ' + raidPokemonBosses[item.raid.level][item.raid.pokemon_id].name + '<br>Time: ' + item.raid.start.substring(0, 16) + ' &tilde; ' + item.raid.end.substring(11, 16) + '</td></tr>';
            whatsappText = 'Raid at: ' + item.location.name + ' (' + gmapsUrl + ')' + '\nTime: ' + item.raid.start.substring(0, 16) + ' ~ ' + item.raid.end.substring(11, 16);
          } else if (item.raid.pokemon_id <= 0) {
            locationPopupBody = '    <tr><th>Raid Info</th></tr>' +
              '    <tr><td>Lvl' + item.raid.level + ' ???<br>Time: ' + item.raid.start.substring(0, 16) + ' &tilde; ' + item.raid.end.substring(11, 16) + '</td></tr>' +
              '    <tr><th>Add Raid Boss</th></tr>' +
              '    <tr><td style="text-align: center;"><img src="images/map-icons/choose-pokemon.png" class="eggie" data-location-id="' + i + '" data-toggle="modal" data-target="#choose-pokemon" data-raid-level="' + item.raid.level + '" data-raid-pokemonid="' + item.raid.pokemon_id + '" data-raid-start="' + item.raid.start + '" data-raid-end="' + item.raid.end + '" style="width:50px;" onclick="addRaid(this, ' + i + ', );" /></td></tr>';
            whatsappText = 'Raid at: ' + item.location.name + ' (' + gmapsUrl + ')' + '\nTime: ' + item.raid.start.substring(0, 16) + ' ~ ' + item.raid.end.substring(11, 16);
          }
        } else {
          locationPopupBody = '    <tr><th>Register an Egg or Raid Boss</th></tr>' +
            '    <tr><td style="text-align: center;"><img src="images/map-icons/choose-egg.png" class="eggie" data-location-id="' + i + '" data-toggle="modal"  data-target="#choose-egg" style="width:50px;" onclick="addRaid(this, ' + i + ');" /><img src="images/map-icons/choose-pokemon.png" class="eggie" data-location-id="' + i + '" data-toggle="modal" data-target="#choose-pokemon" style="width:50px;" onclick="addRaid(this, ' + i + ');" /></td></tr>';
          whatsappText = 'Gym: ' + item.location.name + ' (' + gmapsUrl + ')';
        }
      }

      whatsappUrl = 'https://api.whatsapp.com/send?text=' + escape(whatsappText);

      var popupHtml = '<h2 class="fw700">' + item.location.name + '</h2>' +
        '<div class="mt4 mb4">' +
        '  <a href="' + whatsappUrl + '" rel="nofollow" target="_blank"><img src="images/map-icons/whatsapp.png" style="width:20px;" /></a>' +
        // '  <a class="ml10" href="" target="_blank"><img src="images/map-icons/twitter.png" style="width:20px;" /></a>' +
        '  <a class="ml10" href="' + gmapsUrl + '" target="_blank"><img src="images/map-icons/gmaps.png" style="width:20px;" /></a>' +
        '</div>' +
        '<div class="coordinate">Coordinate: ' + item.location.latitude + ', ' + item.location.longitude + '</div><br/>' +
        '<table class="w100 wiki_p4 mb4">' +
        '  <tbody>' +
        locationPopupBody +
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
        .bindPopup(popupHtml, {
          minWidth: 180
        });
      markersArray.push(marker);
    });
  }).done(function(e) {
    // console.log('second success', e);
    layerGyms = new L.featureGroup(markersArray);
    pogomap.addLayer(layerGyms);
    setInfo();
  }).fail(function(e) {
    console.log('error', e);
  }).always(function(e) {
    // console.log('complete', e);
    // pogomap.fitBounds(layerGyms.getBounds());
  });
}

function updateGym(id, type) {
  var item, useIcon, popupHtml;
  var jqxhrGyms = $.getJSON('php/gyms.php?id=' + id, function(json) {
    item = json[id];
    // console.log(id, item);

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
        break;
    }

    var locationPopupBody = '';
    var gmapsUrl = 'https://maps.google.com/maps?saddr=current+location&daddr=' + item.location.latitude + ',' + item.location.longitude + '&directionsmode=walking';
    var whatsappText = '';
    var whatsappUrl = '';

    if (!loginRequired || ((loginRequired) && (user.level > 0))) {
      if ((item.raid.level > 0) && (new Date().getTime() <= (new Date(item.raid.spawn.split(' ').join('T') + 'Z').getTime() - 7200000))) {
        if (item.raid.pokemon_id > 0) {
          locationPopupBody = '    <tr><th>Raid Info</th></tr>' +
            '    <tr><td>Lvl' + item.raid.level + ': ' + item.raid.pokemon_id + ' - ' + raidPokemonBosses[item.raid.level][item.raid.pokemon_id].name + '<br>Time: ' + item.raid.start.substring(0, 16) + ' &tilde; ' + item.raid.end.substring(11, 16) + '</td></tr>';
          whatsappText = 'Raid at: ' + item.location.name + ' (' + gmapsUrl + ')' + '\nTime: ' + item.raid.start.substring(0, 16) + ' ~ ' + item.raid.end.substring(11, 16);
        } else if (item.raid.pokemon_id <= 0) {
          locationPopupBody = '    <tr><th>Raid Info</th></tr>' +
            '    <tr><td>Lvl' + item.raid.level + ' ???<br> Spawn: ' + item.raid.spawn + '</td></tr>' +
            '    <tr><th>Add Raid Boss</th></tr>' +
            '    <tr><td style="text-align: center;"><img src="images/map-icons/choose-pokemon.png" class="eggie" data-location-id="' + id + '" data-toggle="modal" data-target="#choose-pokemon" data-raid-level="' + item.raid.level + '" data-raid-pokemonid="' + item.raid.pokemon_id + '" data-raid-spawn="' + item.raid.spawn + '" style="width:50px;" onclick="addRaid(this, ' + id + ', );" /></td></tr>';
          whatsappText = 'Gym: ' + item.location.name + ' (' + gmapsUrl + ')';
        } else {
          locationPopupBody = '    <tr><th>Register an Egg or Raid Boss</th></tr>' +
            '    <tr><td style="text-align: center;"><img src="images/map-icons/choose-egg.png" class="eggie" data-location-id="' + id + '" data-toggle="modal"  data-target="#choose-egg" style="width:50px;" onclick="addRaid(this, ' + id + ');" /><img src="images/map-icons/choose-pokemon.png" class="eggie" data-location-id="' + id + '" data-toggle="modal" data-target="#choose-pokemon" style="width:50px;" onclick="addRaid(this, ' + id + ');" /></td></tr>';
          whatsappText = 'Gym: ' + item.location.name + ' (' + gmapsUrl + ')';
        }
      } else if ((item.raid.level > 0) && (new Date().getTime() <= (new Date(item.raid.end.split(' ').join('T') + 'Z').getTime() - 7200000))) {
        if (item.raid.pokemon_id > 0) {
          locationPopupBody = '    <tr><th>Raid Info</th></tr>' +
            '    <tr><td>Lvl' + item.raid.level + ': ' + item.raid.pokemon_id + ' - ' + raidPokemonBosses[item.raid.level][item.raid.pokemon_id].name + '<br>Time: ' + item.raid.start.substring(0, 16) + ' &tilde; ' + item.raid.end.substring(11, 16) + '</td></tr>';
          whatsappText = 'Raid at: ' + item.location.name + ' (' + gmapsUrl + ')' + '\nTime: ' + item.raid.start.substring(0, 16) + ' ~ ' + item.raid.end.substring(11, 16);
        } else if (item.raid.pokemon_id <= 0) {
          locationPopupBody = '    <tr><th>Raid Info</th></tr>' +
            '    <tr><td>Lvl' + item.raid.level + ' ???<br>Time: ' + item.raid.start.substring(0, 16) + ' &tilde; ' + item.raid.end.substring(11, 16) + '</td></tr>' +
            '    <tr><th>Add Raid Boss</th></tr>' +
            '    <tr><td style="text-align: center;"><img src="images/map-icons/choose-pokemon.png" class="eggie" data-location-id="' + id + '" data-toggle="modal" data-target="#choose-pokemon" data-raid-level="' + item.raid.level + '" data-raid-pokemonid="' + item.raid.pokemon_id + '" data-raid-start="' + item.raid.start + '" data-raid-end="' + item.raid.end + '" style="width:50px;" onclick="addRaid(this, ' + id + ', );" /></td></tr>';
          whatsappText = 'Raid at: ' + item.location.name + ' (' + gmapsUrl + ')' + '\nTime: ' + item.raid.start.substring(0, 16) + ' ~ ' + item.raid.end.substring(11, 16);
        }
      } else {
        locationPopupBody = '    <tr><th>Register an Egg or Raid Boss</th></tr>' +
          '    <tr><td style="text-align: center;"><img src="images/map-icons/choose-egg.png" class="eggie" data-location-id="' + id + '" data-toggle="modal"  data-target="#choose-egg" style="width:50px;" onclick="addRaid(this, ' + id + ');" /><img src="images/map-icons/choose-pokemon.png" class="eggie" data-location-id="' + id + '" data-toggle="modal" data-target="#choose-pokemon" style="width:50px;" onclick="addRaid(this, ' + id + ');" /></td></tr>';
        whatsappText = 'Gym: ' + item.location.name + ' (' + gmapsUrl + ')';
      }
    }

    whatsappUrl = 'https://api.whatsapp.com/send?text=' + escape(whatsappText);

    popupHtml = '<h2 class="fw700">' + item.location.name + '</h2>' +
      '<div class="mt4 mb4">' +
      '  <a href="' + whatsappUrl + '" rel="nofollow" target="_blank"><img src="images/map-icons/whatsapp.png" style="width:20px;" /></a>' +
      '  <a class="ml10" href="' + gmapsUrl + '" target="_blank"><img src="images/map-icons/gmaps.png" style="width:20px;" /></a>' +
      '</div>' +
      '<div class="coordinate">Coordinate: ' + item.location.latitude + ', ' + item.location.longitude + '</div><br/>' +
      '<table class="w100 wiki_p4 mb4">' +
      '  <tbody>' +
      locationPopupBody +
      '  </tbody>' +
      '</table>';
  }).done(function(e) {
    // console.log('second success', e);
    markersArray[id - 1].options = {
      alt: id,
      title: item.location.name,
      icon: useIcon,
      virtual: true,
      id: id,
      raid: item.raid,
      lure_timer: '',
      titleDashed: '',
      pokemonId: item.raid.pokemon_id
    };
    if (new Date().getTime() <= (new Date(item.raid.spawn.split(' ').join('T') + 'Z').getTime() - 7200000)) {
      markersArray[id - 1].setIcon(useIcon);
    } else {
      markersArray[id - 1].setIcon(newDivIcon(item.raid.level, item.raid.pokemon_id));
    }
    markersArray[id - 1]._popup.setContent(popupHtml);
    $(markersArray[id - 1]._icon).addClass('leaflet-interactive');
    setInfo(id);
  }).fail(function(e) {
    console.log('error', e);
  }).always(function(e) {
    // console.log('complete', e);
  });
}

function setInfo(id) {
  // Get todays date and time
  var date = new Date();
  var now = date.getTime();
  var timezoneOffset = '+' + Math.abs((date.getTimezoneOffset() / 60)) + '000';
  var timestampSpawn, timestampStart, timestampEnd, locationId, locationName, raidId, raidLevel, pokemonId;

  if ($('#tooltip' + id).length <= 0) {
    if (id !== undefined) {
      id = id - 1;
      if (markersArray[id].options.raid.level > 0) {
        spawn = markersArray[id].options.raid.spawn.split(' ').join('T') + 'Z';
        start = markersArray[id].options.raid.start.split(' ').join('T') + 'Z';
        end = markersArray[id].options.raid.end.split(' ').join('T') + 'Z';
        timestampSpawn = new Date(spawn).getTime() - 7200000;
        timestampStart = new Date(start).getTime() - 7200000;
        timestampEnd = new Date(end).getTime() - 7200000;
        locationId = markersArray[id].options.id;
        locationName = markersArray[id].options.title;
        raidId = markersArray[id].options.raid.id;
        raidLevel = markersArray[id].options.raid.level;
        pokemonId = markersArray[id].options.raid.pokemon_id;

        // console.log(markersArray[id], timestampSpawn, timestampStart, timestampEnd, locationId, locationName);
        markersArray[id].bindTooltip('', {
            permanent: true,
            direction: 'bottom',
            className: 'leaflet-tooltip-bottom-custom'
          })
          .setTooltipContent('<div id="tooltip' + locationId + '" data-raid-id="' + raidId + '" data-raid-name="' + locationName + '"></div>');

        countdowntimer(markersArray[id], locationId, locationName, raidId, raidLevel, timestampSpawn, timestampStart, timestampEnd, pokemonId);
      }
    } else {
      for (var i = 0; i < markersArray.length; i++) {
        if (markersArray[i].options.raid.level > 0) {
          spawn = markersArray[i].options.raid.spawn.split(' ').join('T') + 'Z';
          start = markersArray[i].options.raid.start.split(' ').join('T') + 'Z';
          end = markersArray[i].options.raid.end.split(' ').join('T') + 'Z';
          timestampSpawn = new Date(spawn).getTime() - 7200000;
          timestampStart = new Date(start).getTime() - 7200000;
          timestampEnd = new Date(end).getTime() - 7200000;
          locationId = markersArray[i].options.id;
          locationName = markersArray[i].options.title;
          raidId = markersArray[i].options.raid.id;
          raidLevel = markersArray[i].options.raid.level;
          pokemonId = markersArray[i].options.raid.pokemon_id;

          // console.log(markersArray[i], timestampSpawn, timestampStart, timestampEnd, locationId, locationName);
          markersArray[i].bindTooltip('', {
              permanent: true,
              direction: 'bottom',
              className: 'leaflet-tooltip-bottom-custom'
            })
            .setTooltipContent('<div id="tooltip' + locationId + '" data-raid-id="' + raidId + '" data-raid-name="' + locationName + '"></div>');

          countdowntimer(markersArray[i], locationId, locationName, raidId, raidLevel, timestampSpawn, timestampStart, timestampEnd, pokemonId);
        }
      }
    }
  }
}

function countdowntimer(element, locationId, locationName, raidId, raidLevel, timestampSpawn, timestampStart, timestampEnd, pokemonId) {
  var div = document.getElementById('tooltip' + locationId);
  var now = new Date().getTime();
  var countDownDate;
  var time;

  if ((now >= timestampStart) && (now <= timestampEnd)) {
    time = 'started';
    $('#tooltip' + locationId).parent().addClass('time-started');
    countDownDate = timestampEnd;
    element.setIcon(newDivIcon(raidLevel, pokemonId));
  } else if (now <= timestampStart) {
    time = 'spawn';
    $('#tooltip' + locationId).parent().addClass('time-spawn');
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
    if ((distance < 0) && (time == 'spawn')) {
      countdowntimer(element, locationId, '', raidLevel, timestampSpawn, timestampStart, timestampEnd, pokemonId);
    } else if (distance < 0) {
      clearInterval(x);
      element.setIcon(uncontested).unbindTooltip();
      div.innerHTML = '';
    }
  }, 1000);
}

// Register egg/pkmn or adding raidboss
function addRaid(e, id) {
  var locationId = e.dataset.locationId;
  var raidLevel = e.dataset.raidLevel;
  var raidPokemonid = e.dataset.raidPokemonid;
  var raidSpawn = e.dataset.raidSpawn;
  var raidStart = e.dataset.raidStart;
  var raidEnd = e.dataset.raidEnd;
  var target = e.dataset.target;

  if ((target == '#choose-egg')) {
    var timeNow = new Date().toTimeString().substring(0, 5);
    $('#eggTime').attr('min', timeNow);
    $('#eggTime').attr('value', timeNow);
  }

  $('.locationId').prop('value', id);
  if ((target == '#choose-pokemon') && (raidLevel !== undefined) && (raidPokemonid !== undefined) && (raidStart !== undefined) && (raidEnd !== undefined)) {
    $('#choose-pokemon .form-group.1').html('<p>① Raid Time: </p><p>' + raidStart.substring(0, 16) + ' &tilde; ' + raidEnd.substring(11, 16) + '</p><input type="hidden" id="starttime" name="starttime" value="' + raidStart + '"><input type="hidden" id="endtime" name="endtime" value="' + raidEnd + '">');
    $('#choose-pokemon #gym_egg li[data-lv=' + raidLevel + ']').addClass('selected');
    $('#choose-pokemon .level').val(raidLevel);

    $('#choose-pokemon #gym_boss_list').html('');
    $.each(raidPokemonBosses[raidLevel], function(i, item) {
      if (Object.keys(raidPokemonBosses[raidLevel]).length <= 1) {
        $('#choose-pokemon #gym_boss_list').append('<li data-id="' + i + '" data-name="' + item.name + '" class="selected"><img class="img-fluid" src="images/icons/' + i + '.png"></li>');
      } else {
        $('#choose-pokemon #gym_boss_list').append('<li data-id="' + i + '" data-name="' + item.name + '"><img class="img-fluid" src="images/icons/' + i + '.png"></li>');
      }
    });

    $('#choose-pokemon #gym_boss_list li').on('click', function(e) {
      $('#choose-pokemon #gym_boss_list li').removeClass('selected');
      $(this).addClass('selected');
      var pokemonId = $(this).attr('data-id');
      $('#choose-pokemon .pokemon_id').prop('value', pokemonId);
      $('#choose-pokemon #registerPokemon').removeAttr('disabled');
    });
  } else if ((target == '#choose-pokemon') && (raidLevel !== undefined) && (raidPokemonid !== undefined) && (raidSpawn !== undefined)) {
    $('#choose-pokemon .form-group.1').html('<p>① Spawn Time: </p><p>' + raidSpawn + '</p><input type="hidden" id="spawntime" name="spawntime" value="' + raidSpawn + '">');
    $('#choose-pokemon #gym_egg li[data-lv=' + raidLevel + ']').addClass('selected');
    $('#choose-pokemon .level').val(raidLevel);

    $('#choose-pokemon #gym_boss_list').html('');
    $.each(raidPokemonBosses[raidLevel], function(i, item) {
      if (Object.keys(raidPokemonBosses[raidLevel]).length <= 1) {
        $('#choose-pokemon #gym_boss_list').append('<li data-id="' + i + '" data-name="' + item.name + '" class="selected"><img class="img-fluid" src="images/icons/' + i + '.png"></li>');
      } else {
        $('#choose-pokemon #gym_boss_list').append('<li data-id="' + i + '" data-name="' + item.name + '"><img class="img-fluid" src="images/icons/' + i + '.png"></li>');
      }
    });

    $('#choose-pokemon #gym_boss_list li').on('click', function(e) {
      $('#choose-pokemon #gym_boss_list li').removeClass('selected');
      $(this).addClass('selected');
      var pokemonId = $(this).attr('data-id');
      $('#choose-pokemon .pokemon_id').prop('value', pokemonId);
      $('#choose-pokemon #registerPokemon').removeAttr('disabled');
    });
  } else {
    $('#choose-pokemon .form-group.1').html('<p>① Time minutes left:</p><input type="number" class="inputSmallBar" id="pokemonTime" name="minutes" min="1" max="45" placeholder="45" required>');
  }
}

function newDivIcon(raidLevel, pokemonId) {
  if ((pokemonId !== undefined) && (pokemonId > 0)) {
    iconHTML = '<img class="egg" src="images/map-icons/raid.png" />' +
      '<div class="egg-pokemon"><img class="pokemon-icon" src="images/icons/' + pokemonId + '.png" /></div>' +
      '<span class="egg-text">' + raidLevel + '</span>';
  } else {
    iconHTML = '<img class="egg" src="images/map-icons/raidlv0.png" />' +
      '<span class="egg-text">' + raidLevel + '</span>';
  }

  return new L.DivIcon({ className: 'egg', html: iconHTML });
}