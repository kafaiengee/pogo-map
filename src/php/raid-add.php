<?php

require_once('common.php');
  
// file_put_contents("test.txt", file_get_contents("php://input"));

$rawdata = $_POST || $_GET;

$update = $rawdata['update'] || false;
$level = $rawdata['level'] || 0;
$spawn = $rawdata['spawn'] || date('Y-m-d H:i:s');
$start = $rawdata['start'] || date('Y-m-d H:i:s');
$end = $rawdata['end'] || date('Y-m-d H:i:s');
$pokemon_id = $rawdata['pokemon_id'] || 0;
$move_1_id = $rawdata['move_1_id'] || 0;
$move_2_id = $rawdata['move_2_id'] || 0;
$team_id = $rawdata['team_id'] || 0;
$active = $rawdata['active'] || true;

print_r($update . ', ' . NULL . ', ' . $level . ', ' . $spawn . ', ' . $start . ', ' . $end . ', ' . $pokemon_id . ', ' . $move_1_id . ', ' . $move_2_id . ', ' . $team_id . ', ' . $active);
echo '<br>';

if ($update) {
  $query = "UPDATE `raids` SET '$cell_name' = '$value' where id = $id";
  $query = "INSERT INTO `raids` (`id`, `level`, `spawn`, `start`, `end`, `pokemon_id`, `move_1_id`, `move_2_id`, `team_id`, `active`)
          VALUES (NULL, '$level', '$spawn', '$start', '$end', $pokemon_id, $move_1_id, $move_2_id, $team_id, '$active');";
} else {
  $query = "INSERT INTO `raids` (`id`, `level`, `spawn`, `start`, `end`, `pokemon_id`, `move_1_id`, `move_2_id`, `team_id`, `active`)
          VALUES (NULL, '$level', '$spawn', '$start', '$end', $pokemon_id, $move_1_id, $move_2_id, $team_id, '$active');";
}

$result = mysqli_query($dblink, $query) or die("raids > " . mysqli_error($dblink) . " > " . $query);

// print_r(json_encode(utf8ize($rawdata), JSON_FORCE_OBJECT));

// json_last_error();