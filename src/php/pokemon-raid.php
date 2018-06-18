<?php

require_once('common.php');

$query = 'SELECT * FROM `pokemons` WHERE `raid_lvl` != \'0\' ORDER BY `pokemons`.`raid_lvl` ASC';

$result = mysqli_query($dblink, $query) or die(mysqli_error($dblink));

while ( $row = mysqli_fetch_array($result, MYSQLI_ASSOC) ) {
  $pokemons = array();
  $pokemon = array();
  $pokemon_id = '';
  $raid_lvl_array = array();
  $raid_lvl = '';
  
  foreach ($row as $pokemon_key => $pokemon_value) {
    $pokemon_key = trim((string)$pokemon_key);
    $pokemon_value = trim((string)$pokemon_value);

    if ($pokemon_key == 'raid_lvl') {
      $raid_lvl = $pokemon_value;
    } else if ($pokemon_key == 'id') {
      $pokemon_id = $pokemon_value;
    } else {
      $pokemon[$pokemon_key] = $pokemon_value;
    }
  }
  
  $data[$raid_lvl][$pokemon_id] = $pokemon;
}

// print_r($data);
print_r(json_encode(utf8ize($data), JSON_FORCE_OBJECT));

json_last_error();
