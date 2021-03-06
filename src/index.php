<?php

if ($_SERVER["SERVER_NAME"] == 'fieldraids.com') {
  $environment = 'fieldraids.com';
} else if ($_SERVER["SERVER_NAME"] == 'www.fieldraids.com') {
  $environment = 'www.fieldraids.com';
} else {
  $environment = 'localhost';
}

if ($_SERVER['SERVER_NAME'] != $environment) {
  print_r('403 - Forbidden!');
  exit;
}

// Initialize the session
session_start();

$username = $firstname = $lastname = $team = '';
$level = '0';
if (isset($_SESSION['username'])) {
  $username = $_SESSION['username'];
}
if (isset($_SESSION['user_firstname'])) {
  $firstname = $_SESSION['user_firstname'];
}
if (isset($_SESSION['user_lastname'])) {
  $lastname = $_SESSION['user_lastname'];
}
if (isset($_SESSION['user_team'])) {
  $team = $_SESSION['user_team'];
}
if (isset($_SESSION['user_level'])) {
  $level = $_SESSION['user_level'];
}
?>

<html>

<head>
  <title>Pokemon Go Map</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.1/dist/leaflet.css" integrity="sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ==" crossorigin="" />
  <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  <link rel="stylesheet" href="css/map.css">
  <link rel="stylesheet" href="css/application.css">
  <link rel="stylesheet" href="css/styles.css">

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js" integrity="sha384-h0AbiXch4ZDo7tp9hKZ4TsHbi047NrKGLO3SEJAg45jXxnGIfYzk4Si90RDIqNm1" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/leaflet@1.3.1/dist/leaflet.js" integrity="sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw==" crossorigin=""></script>
  <script src="js/leaflet-plugins/Marker-text.js"></script>
  <script src="js/ams-park-plantsoen-groen.js"></script>
  <script>
    var user = {
      'username': '<?php echo $username ?>',
      'firstname': '<?php echo $firstname ?>',
      'lastname': '<?php echo $lastname ?>',
      'team': '<?php echo $team ?>',
      'level': '<?php echo $level ?>'
    }
  </script>
  <script src="js/scripts.js"></script>
</head>

<body>
  <div id="topbar">
    <!-- <div id="topnav">
      <div class="bar1"></div>
      <div class="bar2"></div>
      <div class="bar3"></div>
    </div> -->
    <div id="login" data-toggle="modal" data-target="#login-window"></div>
  </div>
  <div id="mapid"></div>
  <div id="dialog"></div>
  <div class="modal fade" id="choose-egg" tabindex="-1" role="dialog" aria-labelledby="Choose-Egg" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <form id="choose-egg-form" action="php/raid-add.php" method="POST">
          <div class="modal-header">
            <h5 class="modal-title" id="choose-egg-title">Add raid: Choose Egg Level</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container">
              <div class="row justify-content-md-center">
                <div class="text-center">
                  <div class="form-group">
                    <p>① Enter start time:</p>
                    <input type="time" id="eggTime" name="time" min="08:00:00" max="21:00:00" value="12:00:00" required>
                  </div>
                  <p>② Choose the egg to register</p>
                  <div class="form-group text-center">
                    <ul id="gym_egg">
                      <li data-lv="1" class=""><img class="img-fluid" src="images/map-icons/raidlv1.png"></li>
                      <li data-lv="2" class=""><img class="img-fluid" src="images/map-icons/raidlv2.png"></li>
                      <li data-lv="3" class=""><img class="img-fluid" src="images/map-icons/raidlv3.png"></li>
                      <li data-lv="4" class=""><img class="img-fluid" src="images/map-icons/raidlv4.png"></li>
                      <li data-lv="5" class=""><img class="img-fluid" src="images/map-icons/raidlv5.png"></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="form-group">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="submit" id="registerEgg" class="btn btn-primary" disabled>Register</button>
            </div>
          </div>
          <input type="hidden" class="locationId" name="locationId" value="">
          <input type="hidden" class="level" name="level" value="">
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="choose-pokemon" tabindex="-1" role="dialog" aria-labelledby="ChoosePokemon" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <form id="choose-pokemon-form" action="php/raid-add.php" method="POST">
          <div class="modal-header">
            <h5 class="modal-title" id="choose-pokemon-title">Add raid: Choose Pokemon</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container">
              <div class="row justify-content-md-center">
                <div class="text-center">
                  <div class="form-group 1">
                    <p>① Time minutes left:</p>
                    <input type="number" id="pokemonTime" name="minutes" min="1" max="45" placeholder="45" required>
                  </div>
                  <div class="form-group 2">
                    <p>② Select your egg to register</p>
                    <ul id="gym_egg">
                      <li data-lv="1" class=""><img class="img-fluid" src="images/map-icons/raidlv1.png"></li>
                      <li data-lv="2" class=""><img class="img-fluid" src="images/map-icons/raidlv2.png"></li>
                      <li data-lv="3" class=""><img class="img-fluid" src="images/map-icons/raidlv3.png"></li>
                      <li data-lv="4" class=""><img class="img-fluid" src="images/map-icons/raidlv4.png"></li>
                      <li data-lv="5" class=""><img class="img-fluid" src="images/map-icons/raidlv5.png"></li>
                    </ul>
                  </div>
                  <div class="form-group 3">
                    <p>③ Select your Pokemon to register</p>
                    <ul id="gym_boss_list"></ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="form-group ">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="submit" id="registerPokemon" class="btn btn-primary">Register</button>
            </div>
          </div>
          <input type="hidden" class="locationId" name="locationId" value="">
          <input type="hidden" class="pokemon_id" name="pokemon_id" value="">
          <input type="hidden" class="level" name="level" value="">
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade autoModal" id="login-window" tabindex="-1" role="dialog" aria-labelledby="loginWindow" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <!-- <div class="modal-header">
          <h5 class="modal-title" id="login-window-title">Login</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div> -->
        <div class="modal-body">
          <object data="php/login.php" width="auto" height="350"></object>
        </div>
      </div>
    </div>
  </div>
</body>

</html>
