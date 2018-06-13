<?php

$environment = ($_SERVER["SERVER_NAME"] == 'localhost') ? 'localhost' : ($_SERVER["SERVER_NAME"] == 'www.fieldraids.com') ? 'www.fieldraids.com' : 'fieldraids.com';
if ($_SERVER['SERVER_NAME'] != $environment) {
  print_r('403 - Forbidden!');
  exit;
}

// Include config file
require_once 'common.php';

// Initialize the session
session_start();

// If session variable is set it will redirect to welcome page
if (isset($_SESSION['username'])) {
  header("location: welcome.php");
  exit;
}

// Define variables and initialize with empty values
$username = $password = "";
$username_err = $password_err = "";

// Processing form data when form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // Check if username is empty
  if (empty(trim($_POST["username"]))) {
    $username_err = 'Please enter username.';
  } else {
    $username = trim($_POST["username"]);
  }
  // Check if password is empty
  if (empty(trim($_POST['password']))) {
    $password_err = 'Please enter your password.';
  } else {
    $password = trim($_POST['password']);
  }
  // Validate credentials
  if (empty($username_err) && empty($password_err)) {
    // Prepare a select statement
    $sql = "SELECT user_name, user_password FROM users WHERE user_name = ?";
    if ($stmt = $dblink->prepare($sql)) {
      // Bind variables to the prepared statement as parameters
      $stmt->bind_param("s", $param_username);
      // Set parameters
      $param_username = $username;
      // Attempt to execute the prepared statement
      if ($stmt->execute()) {
        // Store result
        $stmt->store_result();
        // Check if username exists, if yes then verify password
        if ($stmt->num_rows == 1) {
          // Bind result variables
          $stmt->bind_result($username, $hashed_password);
          if ($stmt->fetch()) {
            print_r($stmt->fetch());
            if (password_verify($password, $hashed_password)) {
              /* Password is correct, so start a new session and
              save the username to the session */
              // session_start();
              $_SESSION['username'] = $username;
              $sql = "SELECT * FROM users WHERE user_name = '$username'";
              $result = mysqli_query($dblink, $sql) or die(mysqli_error($dblink));

              while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
                $_SESSION['user_firstname'] = $row['user_firstname'];
                $_SESSION['user_lastname'] = $row['user_lastname'];
                $_SESSION['user_team'] = $row['user_team'];
                $_SESSION['user_level'] = $row['user_level'];
              }
              header("location: welcome.php");
            } else {
              // Display an error message if password is not valid
              $password_err = 'The password you entered was not valid.';
            }
          }
        } else {
          // Display an error message if username doesn't exist
          $username_err = 'No account found with that username.';
        }
      } else {
        echo "Oops! Something went wrong. Please try again later.";
      }
    }
    // Close statement
    $stmt->close();
  }
  // Close connection
  $dblink->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css">
  <style type="text/css">
    body{ font: 14px sans-serif; }
    .wrapper{ width: auto; }
  </style>
</head>
<body>
  <div class="wrapper">
    <h2>Login</h2>
    <p>Please fill in your credentials to login.</p>
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
      <div class="form-group <?php echo (!empty($username_err)) ? 'has-error' : ''; ?>">
        <label>Username</label>
        <input type="text" name="username"class="form-control" value="<?php echo $username; ?>">
        <span class="help-block"><?php echo $username_err; ?></span>
      </div>
      <div class="form-group <?php echo (!empty($password_err)) ? 'has-error' : ''; ?>">
        <label>Password</label>
        <input type="password" name="password" class="form-control">
        <span class="help-block"><?php echo $password_err; ?></span>
      </div>
      <div class="form-group">
        <input type="submit" class="btn btn-primary" value="Login">
      </div>
      <p>Don't have an account? <a href="register.php" onclick="javascript:window.parent.document.getElementsByTagName('object')[0].height='570';">Sign up now</a>.</p>
    </form>
  </div>
</body>
</html>
