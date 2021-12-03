<?php 
require ("../C_MySQL.php");
require ("C_UploadFile.php");
// File Upload
if ($_POST['action'] == "upload") {
    $uploadFile = new UploadFile();
    $uploadFile->uploadFile($mySQL);
} else {
    echo ("An error has occured");
}
?>