<?php 
require ("../C_MySQL.php");
require ("C_UploadImage.php");
// Image Upload

if (isset($_FILES["fileToUpload"]) && isset($_POST["uploadPhoto"])) {
    $uploadImage = new uploadImage();
    $uploadImage->uploadImage($mySQL);
} else {
    echo ("An error has occured");
}
?>