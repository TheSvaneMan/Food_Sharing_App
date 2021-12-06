<?php
session_start();
header("Access-Control-Allow-Credentials: *");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
header("Content-Type: x-www-form-urlencoded; charset=UTF-8");

// MySQL Class
require "C_MySQL.php";
// Security Class
require "security/C_Security.php";
// Login Class
require "security/login/C_Login.php";
// Signup Class
require "security/signup/C_SignUp.php";
// Logout Class
require "security/logout/C_Logout.php";
// Search Class
require "dataRetrieval/C_Search.php";
// New Account Class
require "security/newAcc/C_NewAccount.php";

// -------------------------- instantiate class and functions ------------------------------------ //
// I made nested security features to increase security modularity in the future.
$security = new Security($mySQL);

if (isset($_GET['action'])) {
    if ($_GET['action'] == "login") {
        // Login Process
        $newUser = json_decode(file_get_contents("php://input"));
        $email = $newUser->Email;
        $password = $newUser->Password;
        // Nested security features
        $security->Login($email, $password);
    } else if ($_GET['action'] == "signUp") {
        // SignUp Process
        $newUser = json_decode(file_get_contents("php://input"));
        // Sign Up procedure is a 2 step process
        // Create Login Account
        $email = $newUser->Email;
        $password = $newUser->Password;
        $security->SignUp($email, $password);
        // Wait 2 seconds here to confirm data parsed successfully
        sleep(2);
        // Once that is complete, create user account with the same data
        // Create User Account
        $userAccount = new NewAccount($mySQL);
        $userAccount->AddUserToDB($newUser->Firstname, $newUser->Lastname, $newUser->City, $newUser->Country, $newUser->PostalCode, $newUser->Birthday, $newUser->InterestedIn);
        // Once new User is created, automatically log them in
        $security->Login($email, $password);
    } else if ($_GET['action'] == 'logOut') {
        // Logout function
        $security->LogOut();
    }
} else {
    echo "None of the above runs";
}
