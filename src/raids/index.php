<?php

if ($_SERVER["SERVER_NAME"] == 'fieldraids.com') {
    $environment = 'fieldraids.com';
} elseif ($_SERVER["SERVER_NAME"] == 'www.fieldraids.com') {
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
  <link rel="stylesheet" href="../css/application.css">
  <link rel="stylesheet" href="../css/map.css">
  <link rel="stylesheet" href="../css/styles.css">

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js" integrity="sha384-h0AbiXch4ZDo7tp9hKZ4TsHbi047NrKGLO3SEJAg45jXxnGIfYzk4Si90RDIqNm1" crossorigin="anonymous"></script>

  <script>
    var user = {
      'username': '<?php echo $username ?>',
      'firstname': '<?php echo $firstname ?>',
      'lastname': '<?php echo $lastname ?>',
      'team': '<?php echo $team ?>',
      'level': '<?php echo $level ?>'
    }
  </script>
  <script src="../js/scripts-raids.js"></script>
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
  <div id="filters">
    <div class="form-group">
      <label for="filterRange">Raid Level: </label><br>
      <input type="range" class="form-control-range" min="0" max="5" id="filterRange" list="filterRangeList">
      <datalist id="filterRangeList">
        <option value="0" label="All">
        <option value="1" label="1">
        <option value="2" label="2">
        <option value="3" label="3">
        <option value="4" label="4">
        <option value="5" label="5">
      </datalist>
    </div>
  <!-- 
    https://www.webslesson.info/2017/05/bootstrap-multi-select-dropdown-with-checkboxes-using-jquery-in-php.html
  -->
  <!-- <div class="container">
    <div class="form-group">
     <select id="framework" name="framework[]" multiple class="form-control" >
      <option value="Codeigniter">Codeigniter</option>
      <option value="CakePHP">CakePHP</option>
      <option value="Laravel">Laravel</option>
      <option value="YII">YII</option>
      <option value="Zend">Zend</option>
      <option value="Symfony">Symfony</option>
      <option value="Phalcon">Phalcon</option>
      <option value="Slim">Slim</option>
     </select>
    </div>
    <div class="form-group">
     <input type="submit" class="btn btn-info" name="submit" value="Submit" />
    </div>
  </div> -->
  <!-- <select class="custom-select">
    <option selected>Open this select menu</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select> -->
  </div>
  <div id="raids">
    <div class="raid" id="raidcard">
      <div class="content">
        <h2 class="fw700 lh16 header"></h2>
        <div class="ml4 mt4 mb4">
          <a href="https://api.whatsapp.com/send?text=" rel="nofollow" target="_blank"><img src="../images/map-icons/whatsapp.png" style="width:20px;" /></a>
          <a class="ml5" href="" target="_blank"><img src="../images/map-icons/gmaps.png" style="width:20px;"/></a>
          <img class="gymImage" src="" />
        </div>
        <br>
        <table class="w100 wiki_p4 mb4">
          <tbody>
            <tr><th>Raid Info</th></tr>
            <tr><td style="border: 0;">
              <span class="lvl"></span><br>
              <span class="lvlpokemon"></span><br>
              <span class="spawntime"></span>
              <span class="raidtime"></span>
            </td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="modal fade autoModal" id="login-window" tabindex="-1" role="dialog" aria-labelledby="loginWindow" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-body">
        </div>
      </div>
    </div>
  </div>
</body>

</html>
