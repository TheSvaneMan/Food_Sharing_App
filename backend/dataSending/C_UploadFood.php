<?php
class UploadFoodData{
    public $mySQL;
    public function __construct($mySQL)
    {
        $this->mySQL = $mySQL;
    }
    public function UploadMeal($rawMealData)
    {
        // Handle the food object within this function 
        $name = $rawMealData->FoodName;
        $image = $rawMealData->FoodImage;
        $description = $rawMealData->FoodDescription;
        $container = $rawMealData->FoodContainer;
        $price = $rawMealData->FoodPrice;
        $location = $rawMealData->FoodLocation;
        $owner = $_SESSION['userInfo']['userID'];
        $bestBeforeDate = $rawMealData->FoodBestBeforeDate;
        $freeLastDay = $rawMealData->FoodFreeLastDay;
        var_dump($rawMealData);
        $sql = "CALL AddNewMeal('$name', '$image', '$description', '$container', '$price', '$owner', '$location', NOW(), NOW(), '$bestBeforeDate', '$freeLastDay')";
        $this->mySQL->query($sql);
    }
    public function UploadAllergyData()
    {
        // Get local storage json
        $jsonFile = file_get_contents("load_data/all-users-all-data.json");
        return $jsonFile;
    }
    public function UploadCategoryData()
    {
        // Get local storage json
        $jsonFile = file_get_contents("load_data/all-users-all-data.json");
        return $jsonFile;
    }
}

?>