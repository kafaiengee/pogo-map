<?php

require_once('common.php');
  
// file_put_contents("test.txt", file_get_contents("php://input"));

// print_r($_POST);
// echo "<br>\n";

$update = (isset($_POST['update']) ? $_POST['update'] : false);
$raid = (isset($_POST['raid']) ? $_POST['raid'] : false);
$level = (isset($_POST['level']) ? $_POST['level'] : '0');
$spawn = (isset($_POST['spawn']) ? $_POST['spawn'] : date('Y-m-d H:i:s'));
$start = (isset($_POST['start']) ? $_POST['start'] : date('Y-m-d H:i:s'));
$end = (isset($_POST['end']) ? $_POST['end'] : date('Y-m-d H:i:s'));
$minutes = (isset($_POST['minutes']) ? $_POST['minutes'] : '0');
$pokemon_id = (isset($_POST['pokemonId']) ? $_POST['pokemonId'] : '0');
$move_1_id = (isset($_POST['move_1_id']) ? $_POST['move_1_id'] : '0');
$move_2_id = (isset($_POST['move_2_id']) ? $_POST['move_2_id'] : '0');
$team_id = (isset($_POST['team_id']) ? $_POST['team_id'] : '0');
$active = (isset($_POST['active']) ? $_POST['active'] : true);
$locationId = (isset($_POST['locationId']) ? $_POST['locationId'] : '0');
$user = (isset($_POST['user']) ? $_POST['user'] : 'Anonymous');


if ($raid == 'egg') {
  $time = $spawn;
  
  $spawn = date('Y-m-d ' . $spawn);
  $start = $spawn;
  $end = date('Y-m-d H:i:s', strtotime($start) + (45 * 60));

  // print_r(NULL . ', ' . $level . ', ' . $spawn . ', ' . $start . ', ' . $end . ', ' . $pokemon_id . ', ' . $move_1_id . ', ' . $move_2_id . ', ' . $team_id . ', ' . $active);

  $query = "INSERT INTO `raids` (`id`, `level`, `spawn`, `start`, `end`, `pokemon_id`, `move_1_id`, `move_2_id`, `team_id`, `user`, `active`) VALUES (NULL, '$level', '$spawn', '$start', '$end', $pokemon_id, $move_1_id, $move_2_id, $team_id, '$user', '$active');";
  echo $query . "<br>\n";
  $result = mysqli_query($dblink, $query) or die('raids > ' . mysqli_error($dblink) . ' > ' . $query);
  $raidId = mysqli_insert_id($dblink);

  $query2 = "UPDATE `gyms` SET `raid_id` = $raidId WHERE id = $locationId";
  echo $query2 . "<br>\n";
  $result2 = mysqli_query($dblink, $query2) or die('gyms > ' . mysqli_error($dblink) . ' > ' . $query2);
}

if ($raid == 'pokemon-add') {
  $date = date('Y-m-d H:i:s');
  $end = date('Y-m-d H:i:s', strtotime($date) + ($minutes * 60));

  $spawn = date('Y-m-d H:i:s', strtotime($end) - (105 * 60));
  $start = date('Y-m-d H:i:s', strtotime($end) - (45 * 60));

  // print_r(NULL . ', ' . $level . ', ' . $spawn . ', ' . $start . ', ' . $end . ', ' . $pokemon_id . ', ' . $move_1_id . ', ' . $move_2_id . ', ' . $team_id . ', ' . $active);
  $query = "INSERT INTO `raids` (`id`, `level`, `spawn`, `start`, `end`, `pokemon_id`, `move_1_id`, `move_2_id`, `team_id`, `user`, `active`) VALUES (NULL, '$level', '$spawn', '$start', '$end', $pokemon_id, $move_1_id, $move_2_id, $team_id, '$user', '$active');";
  echo $query . "<br>\n";
  $result = mysqli_query($dblink, $query) or die('raids > ' . mysqli_error($dblink) . ' > ' . $query);
  $raidId = mysqli_insert_id($dblink);
  
  $query2 = "UPDATE `gyms` SET `raid_id` = $raidId WHERE id = $locationId";
  echo $query2 . "<br>\n";
  $result2 = mysqli_query($dblink, $query2) or die('gyms > ' . mysqli_error($dblink) . ' > ' . $query2);
}

if ($raid == 'pokemon-update') {
  $query = "SELECT * FROM `gyms` WHERE `location_id` = $locationId";
  echo $query . "<br>\n";
  $result = mysqli_query($dblink, $query) or die('gyms > ' . mysqli_error($dblink) . ' > ' . $query);

  while ( $row = mysqli_fetch_array($result, MYSQLI_ASSOC) ) {
    $raidId = $row['raid_id'] . "<br>\n";
  }

  $sql = "UPDATE raids SET pokemon_id = ? WHERE id = ?";
  if ($stmt = $dblink->prepare($sql)) {
    // Bind variables to the prepared statement as parameters
    $stmt->bind_param("ii", $pokemon_id, $raidId);
    // Attempt to execute the prepared statement
    if ($stmt->execute()) {
      // store result
      $stmt->store_result();
      // print_r($stmt);
    } else {
      echo "Oops! Something went wrong. Please try again later.";
    }
  }

  $sql2 = "UPDATE `raids` SET `user` = '?' WHERE `id` = ?";
  if ($stmt = $dblink->prepare($sql2)) {
    // Bind variables to the prepared statement as parameters
    $stmt->bind_param("si", $pokemon_id, $raidId);
    // Attempt to execute the prepared statement
    if ($stmt->execute()) {
      // store result
      $stmt->store_result();
      // print_r($stmt);
    } else {
      echo "Oops! Something went wrong. Please try again later.";
    }
  }
  // Close statement
  $stmt->close();
}
