<?php
class LoadFoodData
{
    public $mySQL;
    public function __construct($mySQL)
    {
        $this->mySQL = $mySQL;
    }
    public function GetJSONData()
    {
        // Get local storage json
        $jsonFile = file_get_contents("load_data/all-users-all-data.json");
        return $jsonFile;
    }
    public function GetJSONDataDecoded()
    {
        // Get local storage json
        $jsonFile = file_get_contents("load_data/all-users-all-data.json");
        $users = json_decode($jsonFile);
        return $users;
    }
    public function GetAllOnlineFoodData()
    {
        // MySQL Request for all food (Does not contain Allergy + Category data)
        $selectAllFood = "SELECT * FROM food";
        $allFoodData = $this->mySQL->query($selectAllFood);
        // If the query was a success, then convert all the results to a data array
        if ($allFoodData) {
            // Create an array for the JSON response
            $data = [];
            while ($row = $allFoodData->fetch_assoc()) {
                $data[] = $row;
            }
        }
        // Encode the result as JSON and return it
        return json_encode($data);
    }

    public function GetUserFoodData($id){
        // MySQL Request for all food (Does not contain Allergy + Category data)
        $selectAllUserFood = "SELECT * FROM food WHERE foodOwner = '$id'";
        $myStoreFood = $this->mySQL->query($selectAllUserFood);
        // If the query was a success, then convert all the results to a data array
        if ($myStoreFood) {
            // Create an array for the JSON response
            $data = [];
            while ($row = $myStoreFood->fetch_assoc()) {
                $data[] = $row;
            }
        }
        // Encode the result as JSON and return it
        return json_encode($data);

    }
}
