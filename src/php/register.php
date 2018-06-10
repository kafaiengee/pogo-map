<?php
// Include config file
require_once 'common.php';

// Define variables and initialize with empty values
$username = $firstname = $lastname = $password = $team = $level = $confirm_password = "";
$username_err = $firstname_err = $lastname_err = $password_err = $confirm_password_err = "";

// Processing form data when form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // Validate username
  if (empty(trim($_POST["username"]))) {
    $username_err = "Please enter a username.";
  } else {
    // Prepare a select statement
    $sql = "SELECT id FROM users WHERE user_name = ?";
    if ($stmt = $dblink->prepare($sql)) {
      // Bind variables to the prepared statement as parameters
      $stmt->bind_param("s", $param_username);
      // Set parameters
      $param_username = trim($_POST["username"]);
      // Attempt to execute the prepared statement
      if ($stmt->execute()) {
        // store result
        $stmt->store_result();
        if ($stmt->num_rows == 1) {
            $username_err = "This username is already taken.";
        } else {
          $username = trim($_POST["username"]);
        }
      } else {
        echo "Oops! Something went wrong. Please try again later.";
      }
    }
    // Close statement
    $stmt->close();
  }
  // Validate password
  if (empty(trim($_POST['password']))) {
    $password_err = "Please enter a password.";
  } elseif (strlen(trim($_POST['password'])) < 6) {
    $password_err = "Password must have atleast 6 characters.";
  } else {
    $password = trim($_POST['password']);
  }
  // Validate confirm password
  if (empty(trim($_POST["confirm_password"]))) {
    $confirm_password_err = 'Please confirm password.';
  } else {
    $confirm_password = trim($_POST['confirm_password']);
    if ($password != $confirm_password) {
      $confirm_password_err = 'Password did not match.';
    }
  }
  // Check input errors before inserting in database
  if (empty($username_err) && empty($password_err) && empty($confirm_password_err)) {
    // Prepare an insert statement
    $sql = "INSERT INTO users (user_name, user_password, user_firstname, user_lastname, user_team, user_level) VALUES (?, ?, ?, ?, ?, ?)";
    if ($stmt = $dblink->prepare($sql)) {
      // Bind variables to the prepared statement as parameters
      $stmt->bind_param("ssss", $param_username, $param_password, $param_firstname, $param_lastname, $param_team, $param_level);
      // Set parameters
      $param_username = $username;
      $param_password = password_hash($password, PASSWORD_DEFAULT); // Creates a password hash
      $param_firstname = $firstname;
      $param_lastname = $lastname;
      $param_team = $team;
      $param_level = "0";
      // Attempt to execute the prepared statement
      if ($stmt->execute()) {
        // Redirect to login page
        header("location: login.php");
      } else {
        echo "Something went wrong. Please try again later.";
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
  <title>Sign Up</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css">
  <style type="text/css">
    body{ font: 14px sans-serif; }
    .wrapper{ width: auto; }
  </style>
</head>
<body>
  <div class="wrapper">
    <h2>Sign Up</h2>
    <p>Please fill this form to create an account.</p>
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
      <div class="form-group <?php echo (!empty($username_err)) ? 'has-error' : ''; ?>">
        <label>Username</label>
        <input type="text" name="username"class="form-control" value="<?php echo $username; ?>">
        <span class="help-block"><?php echo $username_err; ?></span>
      </div>
      <div class="form-group <?php echo (!empty($password_err)) ? 'has-error' : ''; ?>">
        <label>Password</label>
        <input type="password" name="password" class="form-control" value="<?php echo $password; ?>">
        <span class="help-block"><?php echo $password_err; ?></span>
      </div>
      <div class="form-group <?php echo (!empty($confirm_password_err)) ? 'has-error' : ''; ?>">
        <label>Confirm Password</label>
        <input type="password" name="confirm_password" class="form-control" value="<?php echo $confirm_password; ?>">
        <span class="help-block"><?php echo $confirm_password_err; ?></span>
      </div>
      <div class="form-group>">
        <label>First name (optional)</label>
        <input type="text" name="firstname"class="form-control" value="<?php echo $firstname; ?>">
        <span class="help-block"><?php echo $firstname_err; ?></span>
      </div>
      <div class="form-group>">
        <label>Last name (optional)</label>
        <input type="text" name="lastname"class="form-control" value="<?php echo $lastname; ?>">
        <span class="help-block"><?php echo $lastname_err; ?></span>
      </div>
      <div class="form-group>">
        <label>Team (optional)</label>
        <select name="team"class="form-control">
          <option value="">select team</option>
          <option value="mystic">Mystic</option>
          <option value="instinct">Instinct</option>
          <option value="valor">Valor</option>
        </select>
        <span class="help-block"></span>
      </div>
      <div class="form-group">
        <input type="submit" class="btn btn-primary" value="Submit">
        <input type="reset" class="btn btn-default" value="Reset">
      </div>
      <p>Already have an account? <a href="login.php" onclick="javascript:window.parent.document.getElementsByTagName('object')[0].height='350';">Login here</a>.</p>
    </form>
  </div>
</body>
</html>