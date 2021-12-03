<?php
include "C_ResponseObject.php";
class NewAccount
{
    public $mySQL;
    public function __construct($mySQL)
    {
        $this->mySQL = $mySQL;
    }
    public function AddUserToDB($firstname, $lastname, $city, $country, $postalCode, $birthday, $interest)
    {
        $loginID = $_SESSION['userInfo']['loginID'];
        // Random Value helps with unique account creation

        $addUser = "CALL AddNewAccount('$firstname', '$lastname', '$city', '$country', '$postalCode', '$birthday', '$interest', '$loginID')";
        // Requires additional security to prevent random upload
        $this->mySQL->query($addUser);
        $getUserID = "SELECT PK_id FROM userdata WHERE loginID = '$loginID'";
        $userID = $this->mySQL->query($getUserID);
        $newAccID = $userID->fetch_object();
        // Add the UserID to login Table
        $addToLoginDB = "UPDATE userlogin SET userID = '$newAccID->PK_id' WHERE loginID = '$loginID'";
        $this->mySQL->query($addToLoginDB);
        // Search DB
        // Get User ID
        $loginID = $_SESSION['userInfo']['loginID'];
        $loginData = "SELECT * FROM userlogin WHERE loginID = '$loginID'";
        $userID = $this->mySQL->query($loginData);
        $login = $userID->fetch_object();

        // Parent array of all user info
        if (!isset($_SESSION['userInfo'])) {

            $_SESSION['userInfo'] = array();
            $_SESSION['userInfo']['loginID'] = $login->loginID;
            $_SESSION['userInfo']['userID'] = $login->userID;

        } else {
            if (isset($_SESSION['userInfo'])) {
                $_SESSION['userInfo']['loginID'] = $login->loginID;
                $_SESSION['userInfo']['userID'] = $login->userID;

            } else {
                $_SESSION['userInfo']['loginID'] = $login->loginID;
                $_SESSION['userInfo']['userID'] = $login->userID;
            }
        }

        $responseObject = new responseObject();
        $responseObject->status = 200;
        $responseObject->message = "Account Creation Successful!";
        $sendObject = json_encode($responseObject);
        echo $sendObject;
        exit();
    }
}
