<?php
// Starts a new session for a user that enter the website, IMPORTANT **
session_start();
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

// ------------ Classic Imports ------  //
// MySQL
require 'C_MySQL.php';
// Load Food
require "dataRetrieval/C_LoadFood.php";
// Upload Food
require "dataSending/C_UploadFood.php";
// Search Function
require "dataRetrieval/C_Search.php";
// Response Object
require "C_ResponseObject.php";
// ------------ Data Service Classes ------  //
// Handles everything to do with retrieving food related data
$loadFood = new LoadFoodData($mySQL);
// Handles everything to do with sending food related data
$uploadFood = new UploadFoodData($mySQL);
// ------------ Checks Services ------  //
// Currently works with JSON Data, needs to be converted to have
// dual backup of JSON data and having a live online database
// Maybe build a service that checks version states
// ------------ Application Services ------  //
if (isset($_GET['action'])) {
    if ($_GET['action'] == 'getFood') {
        // Load Data from JSON
        // $foodData = $loadUsers->GetJSONData();
        // Load Data from DB
        $foodArray = $loadFood->GetAllOnlineFoodData();
        //var_dump($allUsers);
        echo $foodArray;
    }if ($_GET['action'] == 'getUserFood') {
        // Load Data from JSON
        // $foodData = $loadUsers->GetJSONData();
        $id = $_SESSION['userInfo']['userID'];
        // Load Data from DB
        $myStoreArray = $loadFood->GetUserFoodData($id);
        //var_dump($allUsers);
        echo $myStoreArray;
    } else if ($_GET['action'] == 'addNewFood') {
        // Add Meal to Database
        $newMeal = json_decode(file_get_contents("php://input"));
        $uploadFood->UploadMeal($newMeal);
    } else if ($_GET['action'] == 'deleteFood') {
        // SQL Call to delete the selected food item
        $selectedMealID = $_GET['value'];
        $sql = "DELETE FROM Food WHERE food_id = '$selectedMealID'";
        // Need to create a Food Class that handles this function but for now it is okay
        // Make a check that ther userID assigned to that meal is the same as the ID of the currently logged in user
        $mySQL->query($sql);
        // Create better response object to notify user
        echo "Delete Succesful";
    } else if ($_GET['action'] == 'updateMeal') {
        // SQL Call to upload the selected food item
        $updateMeal = json_decode(file_get_contents("php://input"));
        var_dump($updateMeal);
        $id = $updateMeal->FoodID;
        $name = $updateMeal->FoodName; 
        $description = $updateMeal->FoodDescription;
        $price = $updateMeal->FoodPrice;
        $location = $updateMeal->FoodLocation;

        // Updates the selected food with new data from webpage
        $sql = "UPDATE food SET foodName = '$name', foodDescription = '$description', foodPrice = '$price', foodLocation = '$location' WHERE food_id = '$id';";
        // Update selected food item with new Info
        // Make a check that ther userID assigned to that meal is the same as the ID of the currently logged in user, prevent injections
        // And other thingies
        $mySQL->query($sql);
    } else if ($_GET['action'] == "search") {
        // SQL query to search for meal on db, matching the meal's search input (LIKE is the keyword to do searches)
        $sql = "SELECT * FROM food WHERE foodName LIKE ('%" . $_GET['value'] . "%')";
        $search = new SearchClass();
        $search->searchData($mySQL, $sql);
    }
}
