<?php
class Login
{
    public function LoginUser($setEmail, $setPassword, $mySQL)
    {
        // Check database if username exiss / If not, throw error
        // Verify Password : TRUE || FALSE
        // $hashkey = $passEncrypt : is the password saved in the database
        $email = $setEmail;
        $userPassword = $setPassword;

        $responseObject = new ResponseObject();
        $loginUser = "SELECT email FROM userlogin WHERE email = '$email'";

        if ($mySQL->query($loginUser)) {
            $passwordCall = "SELECT password FROM userlogin WHERE email = '$email'";
            $encryptedPass = $mySQL->query($passwordCall);
            $hashkey = $encryptedPass->fetch_object();
            if ($hashkey !== null) {
                $passVerify = password_verify($userPassword, $hashkey->password);
                // Get User ID
                $loginData = "SELECT * FROM userlogin WHERE email = '$email'";
                $userData = $mySQL->query($loginData);
                $login = $userData->fetch_object();
                if ($passVerify) {
                    // Parent array of all user info
                    if (!isset($_SESSION['userInfo'])) {
                        $_SESSION['userInfo'] = array();
                        // PK_Id is for the login system
                        $_SESSION['userInfo']['loginID'] = $login->loginID;
                        // User ID is for the Human db reference
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
                    $loginID = $_SESSION['userInfo']['loginID'];
                    // Once logged in, track that the user is logged in
                    $loggedIn = "UPDATE userlogin SET isLoggedIn = 1 WHERE loginID = '$loginID'";
                    $mySQL->query($loggedIn);
                    // Redirect user to home page
                    $responseObject->status = 200;
                    $responseObject->message = "Authorization Success - Password Verified!";
                    $serveResponse = json_encode($responseObject);
                    echo $serveResponse;
                    // Will create better response objects that help app.js resolve cleaner
                    exit();
                } else {
                    // Redirect user to try again
                    $responseObject->status = 300;
                    $responseObject->message = "Sorry, incorrect password.";
                    $serveResponse = json_encode($responseObject);
                    echo $serveResponse;
                    exit();
                }
            } else {
                // Redirect user to sign up page
                $responseObject->status = 300;
                $responseObject->message = "Sorry, incorrect password, username or user is not registered.";
                $serveResponse = json_encode($responseObject);
                echo $serveResponse;
                exit();
            }
        } else {
            // Redirect user to sign up page
            $responseObject->status = 300;
            $responseObject->message = "User name doesn't exist";
            $serveResponse = json_encode($responseObject);
            echo $serveResponse;
            exit();
        }
    }
}
