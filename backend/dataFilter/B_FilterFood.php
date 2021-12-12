<?php 
// Dynamic Filter Class 
// Dependent on the value given on front-end
// Perhaps more efficient to use int instead of string, but for literacy sake I did this
if ($_GET['value'] == 'foodContainer') {
    // Has a container
    $foodArray = json_decode($foodArray);
    $filteredArray = [];
    foreach($foodArray as $foodItem){
        if($foodItem->foodContainer == 1){
            array_push($filteredArray, $foodItem);
        }
    }
    echo json_encode($filteredArray);
} else if ($_GET['value'] == 'noFoodContainer') {
    // Has no container
    $foodArray = json_decode($foodArray);
    $filteredArray = [];
    foreach ($foodArray as $foodItem) {
        if ($foodItem->foodContainer == 0) {
            array_push($filteredArray, $foodItem);
        }
    }
    echo json_encode($filteredArray);
} else if ($_GET['value'] == 'lowToHigh') {
    // Lowest Price
    $foodArray = json_decode($foodArray);
   $foodPrice = array_column($foodArray, 'foodPrice');
    array_multisort($foodPrice, SORT_ASC, $foodArray);
    echo json_encode($foodArray);
} else if ($_GET['value'] == 'highToLow') {
    // Lowest Price
    $foodArray = json_decode($foodArray);
    $foodPrice = array_column($foodArray, 'foodPrice');
    array_multisort($foodPrice, SORT_DESC, $foodArray);
    echo json_encode($foodArray);
} 

?>