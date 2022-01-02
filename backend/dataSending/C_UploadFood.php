<?php
class UploadFoodData
{
    public $mySQL;
    public function __construct($mySQL)
    {
        $this->mySQL = $mySQL;
    }
    public function UploadMeal($rawMealData, $foodDir)
    {
        $foodDirLoc = $foodDir->fetch_object();
        // Handle the food object within this function
        $name = $rawMealData->FoodName;
        $image = $foodDirLoc->imgDir;
        $description = $rawMealData->FoodDescription;
        $container = $rawMealData->FoodContainer;
        $cooked = $rawMealData->FoodCooked;
        $price = $rawMealData->FoodPrice;
        $location = $rawMealData->FoodLocation;
        $owner = $_SESSION['userInfo']['userID'];
        $bestBeforeDate = $rawMealData->FoodBestBeforeDate;
        $freeLastDay = $rawMealData->FoodFreeLastDay;
        $uniqueID = $owner . rand(0, 100);
        // Go through the food Items Categories
        $sql = "CALL AddNewMeal('$name', '$image', '$description', '$container', '$cooked', '$price', '$owner', '$location', NOW(), NOW(), '$bestBeforeDate', '$freeLastDay', '$uniqueID')";
        $this->mySQL->query($sql);
        // Once complete, add the food ID to the next functions
        // Search for recently uploaded meal and save ID
        // Wait 2 seconds here to confirm data parsed successfully
        // sleep(2);
        $findMeal = "SELECT food_id FROM food WHERE uniqueGeneratedID = '$uniqueID'";
        $foodObject = $this->mySQL->query($findMeal);
        $foodIDobject = $foodObject->fetch_object();
        $foodID = $foodIDobject->food_id;
        // Get and upload food category
        $foodCategory = $rawMealData->FoodCategory;
        $this->UploadFoodCategory($foodID, $foodCategory);
        // Get and upload Food allergy data
        $foodAllergy = $rawMealData->FoodAllergy;
        $this->UploadFoodAllergies($foodID, $foodAllergy);
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

    private function UploadFoodCategory($foodID, $foodCategory)
    {
        // Get the food ID and foodGroup based on category, this is useful imo because if we update the
        // food Cat table we don't have to change the code too much, unfortunately we would have to update old products manually, but
        // we could make a procedure that updates it for us automatically on data changes. Using an admin panel interface
        $getCategories = "SELECT * FROM foodgroup";
        $categoryItems = $this->mySQL->query($getCategories);
        while ($row = $categoryItems->fetch_assoc()) {
            $categories[] = $row;
        }
        foreach ($foodCategory as $key => $value) {
            foreach ($categories as $item) {
                $catItem = (object) $item;
                // Get foodGroup and loop throughforeach ($foodCategory as $key => $value) {
                // $categories = ["milk", "eggs", "fish", "shellfish", "almonds", "pecans", "peanuts", "wheat", "soybeans", "sesame", "brazil nuts", "cashews", "pistachios", "walnuts", "hazelnuts", "cinnamon"];
                if ($key == $catItem->foodGroup && $value == 1) {
                    $sql = "INSERT INTO foodcategoryrecords (foodID, foodCategoryID) VALUES ('$foodID', '$catItem->foodGroupID')";
                    $this->mySQL->query($sql);
                }
            }
        }
    }

    private function UploadFoodAllergies($foodID, $foodAllergy)
    {
        // Get the food ID and foodGroup based on category, this is useful imo because if we update the
        // food Cat table we don't have to change the code too much, unfortunately we would have to update old products manually, but
        // we could make a procedure that updates it for us automatically on data changes. Using an admin panel interface
        $getAllergies = "SELECT * FROM foodallergies";
        $allergyItems = $this->mySQL->query($getAllergies);
        while ($row = $allergyItems->fetch_assoc()) {
            $allergies[] = $row;
        }
        foreach ($foodAllergy as $key => $value) {
            foreach ($allergies as $item) {
                $allergyItem = (object) $item;
                // Get foodGroup and loop throughforeach ($foodCategory as $key => $value) {
                // $categories = ["milk", "eggs", "fish", "shellfish", "almonds", "pecans", "peanuts", "wheat", "soybeans", "sesame", "brazil nuts", "cashews", "pistachios", "walnuts", "hazelnuts", "cinnamon"];
                if ($key == $allergyItem->allergyName && $value == 1) {
                    $sql = "INSERT INTO foodallergyrecords (foodID, foodAllergyID) VALUES ('$foodID', '$allergyItem->allergyID')";
                    $this->mySQL->query($sql);
                }
            }
        }
    }
}
