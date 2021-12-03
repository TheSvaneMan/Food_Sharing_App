<?php
class Logout
{
    public function LogOut($mySQL)
    {
        // Login and track that the user has logged out
        $loginID = $_SESSION['userInfo']['loginID'];
        // Notifies server that user logged out
        $loggedOut = "UPDATE userlogin SET isLoggedIn = 0 WHERE loginID = '$loginID'";
        $mySQL->query($loggedOut);
        session_destroy();
        // Redirects users once the session has ended, prevents loops
        // Redirect user to Sign In page
        $responseObject = new ResponseObject();
        $responseObject->status = 200;
        $responseObject->message = "Successful Log out on this device.";
        $serveResponse = json_encode($responseObject);
        echo $serveResponse;
        exit();
    }
}
?>