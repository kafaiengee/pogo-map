<?php


// $url='https://www.pokemongomap.info/pokestop/nh-kerk-ca-1300/5043032';
// $ch = curl_init();
// $user_agent='Mozilla/5.0 (Windows NT 6.1; rv:8.0) Gecko/20100101 Firefox/8.0';
// curl_setopt($ch, CURLOPT_URL, $url);
// curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
// curl_setopt($ch, CURLOPT_AUTOREFERER, false);
// curl_setopt($ch, CURLOPT_VERBOSE, 1);
// curl_setopt($ch, CURLOPT_HEADER, 0);

// curl_setopt($ch, CURLOPT_USERAGENT, $user_agent);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
// curl_setopt($ch, CURLOPT_SSLVERSION,CURL_SSLVERSION_DEFAULT);
// curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// $webcontent = curl_exec ($ch);
// $error = curl_error($ch);
// curl_close ($ch);

// print_r($webcontent);

$global = 'global_direct_link_';
$main_page_image = 'main_page_image';
$data = [];

$directory = 'C:\Users\kafai.engee.WEBORAMA\Desktop\TEST\_ALL';
$scanned_directory = array_diff(scandir($directory), array('..', '.'));

foreach ($scanned_directory as $key => $value) {
  // echo $key . " > " . $value . "\n";

  $file_rows = file($directory . DIRECTORY_SEPARATOR . $value);
  $temp_data = [];

  foreach ($file_rows as $key => $value) {
    $pos_global = strrpos($value, $global);
    if ($pos_global > 0) {
      $find = ['var global_direct_', '"',';'];
      $replace = [''];
      $temp_value = str_replace($find, $replace, trim($value));
      $temp_value = explode(' = ', $temp_value);
      $temp_data[$temp_value[0]] = $temp_value[1];
    }

    $pos_img = strrpos($value, $main_page_image);
    if ($pos_img > 0) {
      $find = '<div id="main_page_image" style="display:none;"><img src="';
      $replace = '';
      $temp_value = str_replace($find, $replace, trim($value));
      $temp_value = explode('"', $temp_value);
      $temp_data['img'] = $temp_value[0];
    }
  }
  $data[] = $temp_data;
}

// print_r($data);

echo "<table>\n";
echo "  <thead>\n";
echo "    <tr>\n";
echo "      <th>ID</th>\n";
echo "      <th>Clean Name</th>\n";
echo "      <th>Name Raw</th>\n";
echo "      <th>Latitude</th>\n";
echo "      <th>Longitude</th>\n";
echo "      <th>Image</th>\n";
echo "    </tr>\n";
echo "  </thead>\n";
echo "  <tbody>\n";

foreach ($data as $key => $value) {
  echo "    <tr>\n";
  echo "      <td>" . $value['link_id'] . "</td>\n";
  echo "      <td>" . $value['link_clean_name'] . "</td>\n";
  echo "      <td>" . $value['link_name_raw'] . "</td>\n";
  echo "      <td>" . $value['link_lat'] . "</td>\n";
  echo "      <td>" . $value['link_lng'] . "</td>\n";
  echo "      <td>" . $value['img'] . "</td>\n";
  echo "    </tr>\n";
  // break;
}

echo "  </tbody>\n";
echo "</table>\n";
