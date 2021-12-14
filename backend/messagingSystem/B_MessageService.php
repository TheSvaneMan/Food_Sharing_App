<?php
session_start();
// Gain access to the MySQL Class
require "../C_MySQL.php";
require "C_Inbox.php";
require "../C_ResponseObject.php";
$Inbox = new Inbox($mySQL);

if (isset($_GET['action'])) {
    if ($_GET['action'] == 'sendMessage') {
        // Do not encode, leave it object to access properties
        $messageData = json_decode(file_get_contents("php://input"));
        // $messageData = json_encode($newMessage);
        $sender = $_SESSION['userInfo']['userID'];
        $message = $messageData->message;
        $receiver = $messageData->receiver;
        $Inbox->sendMessage($message, $sender, $receiver);
    } else if ($_GET['action'] == 'getMessages') {
        $userID = $_SESSION['userInfo']['userID'];
        $messages = $Inbox->getMessages($userID);
        echo $messages;
    } else if ($_GET['action'] == 'sendFeedback') {
        // Do not encode, leave it object to access properties
        $feedbackMessageData = json_decode(file_get_contents("php://input"));
        $sender = $_SESSION['userInfo']['userID'];
        $query = $feedbackMessageData->query;
        $message = $feedbackMessageData->message;
        $sql = "INSERT INTO feedbackTable (feedbackSender, feedbackQuery, feedbackMessage) VALUES ('$sender', '$query', '$message')";
        $mySQL->query($sql);
        $responseObject = new ResponseObject();
        $responseObject->status = 200;
        $responseObject->message = "Feedback Sent, thank you so much!";
        $serveResponse = json_encode($responseObject);
        echo $serveResponse;
        exit();
    }
}
