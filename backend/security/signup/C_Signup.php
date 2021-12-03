<?php
class SignUp
{
    public function SignUp($email, $password, $mySQL)
    {
        $passEncrypt = password_hash($password, PASSWORD_DEFAULT);
        $userData = "CALL RegisterNewUser('$email', '$passEncrypt')";
        $mySQL->query($userData);
        // Save Login ID to SESSION array
        $loginIDCall = "SELECT loginID FROM userlogin WHERE email = '$email'";
        $userID = $mySQL->query($loginIDCall);
        $uniqueID = $userID->fetch_object();
        if (isset($_SESSION['userInfo'])) {
            $_SESSION['userInfo']['loginID'] = $uniqueID->loginID;
        } else {
            $_SESSION['userInfo']['loginID'] = $uniqueID->loginID;
        }
        // Continues to second part of Account Creation ->
    }
}
?>