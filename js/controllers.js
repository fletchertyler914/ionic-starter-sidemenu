angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

.controller('CategoriesCtrl', function($scope, $rootScope, $firebase) {

  // bind to the Firebase db
  var ref = new Firebase("https://mobilerecall.firebaseio.com/categories");
  
  // create an AngularFire reference to the data
  var sync = $firebase(ref);

  // download the data into a local array
  $rootScope.categories = sync.$asArray();

  // $rootScope.categories = [
  //   { name: 'Movies', id: 0, label: 'Movie title', example: 'Star Wars', icon: 'ion-ios-film' },
  //   { name: 'Music', id: 1, label: 'Song or Artist', example: 'Foo Fighters', icon: 'ion-music-note' },
  //   { name: 'TV', id: 2, label: 'TV Show', example: 'Breaking Bad', icon: 'ion-ios-videocam' },
  //   { name: 'Books', id: 3, label: 'Book or Author', example: 'JR Tolken', icon: 'ion-ios-book' },
  //   { name: 'YouTube', id: 4, label: 'Enter keywords', example: 'grumpy cat', icon: 'ion-social-youtube' },
  //   { name: 'Restaurants', id: 5, label: 'Name', example: 'Local Taco', icon: 'ion-android-restaurant' },
  //   { name: 'Bucket List', id: 6, label: 'Activity', example: 'Skydive', icon: 'ion-paintbucket' }
  // ];

  // for(n=0; n<$rootScope.categories.length; n++) {
  //   $scope.categories.$add($rootScope.categories[n]);
  // }

  // $rootScope.list = [];

})


.controller('CategoryCtrl', function($scope, $stateParams, $rootScope, $firebase, $ionicPopup, store) {
    
    $scope.editedData = {};


 // A confirm dialog
   $scope.confirmDelete = function(item)
   {
      // set a local scope = item.name so it can be used in the modal
      $scope.item = item;

     var confirmPopup = $ionicPopup.show
     ({
         cssClass: 'confirmPop',
         title: 'Delete This Item?',
         template: item.name,
         buttons: [
                    //Cancel Button
                    {text:'Cancel', type: 'button'},
                    //Delete button
                    {text: 'Delete', type: 'button button-positive',onTap: function(e){$scope.delete(item);}} 
                  ]
     });
   };
    
    
    
    
//Confirm Edit    
$scope.confirmEdit = function(item) {
  // set a local scope = item.name so it can be used in the modal
  $scope.item = item;
  var myPopup = $ionicPopup.show({
    cssClass: 'confirmPop',
    template: '<input autofocus class="center" type="text" ng-model="item.name">',
    title: 'Edit',
    scope: $scope,
    buttons: [
              //Cancel Button
              { text: 'Cancel',
                onTap: function(e) {
                  myPopup.close();
                }
              },
              // Edit Button
              {
                text: 'OK', type: 'button button-positive',
                //Function For When Edit Button Is Tapped
                onTap: function(e){
                  if ($scope.item.name === '') {
                    // console.log('no');
                    myPopup.close()
                  }
                  else {
                    // console.log('yes');
                    return $scope.item;
                  }
                }
              }                                                      
                              
            ]
  });

  myPopup.then(function(item) {
    // console.log('result', item);
    if (item) {
      $scope.edit(item);
    }
    else {
      return;
    }
    
  });
};
    
    
// Confirm Archive
$scope.confirmArchive = function(item)
{
    var confirmPopup = $ionicPopup.show
    ({
        cssClass: 'confirmPop',
        title: 'Archive This Item?',
        template: item.name,
        buttons: [
            //Cancel Button
            {text:'Cancel', type: 'button'},
            //Delete button
            {text: 'Archive', type: 'button button-positive',onTap: function(e){$scope.archive(item);}} 
        ]
    });
};

    
// Confirm Unarchive
$scope.confirmUnarchive = function(item)
{
    var confirmPopup = $ionicPopup.show
    ({
        cssClass: 'confirmPop',
        title: 'Unarchive This Item?',
        template: item.name,
        buttons: [
            //Cancel Button
            {text:'Cancel', type: 'button'},
            //Delete button
            {text: 'Unarchive', type: 'button button-positive',onTap: function(e){$scope.unArchive(item);}} 
        ]
    });
};

  var user_id = store.get('profile').user_id.split('|');
  var id = user_id[1];
  console.log(id);

  // define the current category
  $scope.category = $scope.categories[$stateParams.categoryId];

  // bind to the Firebase db
  var ref = new Firebase("https://mobilerecall.firebaseio.com/"+"/"+id+"/"+$scope.category.id);
  
  // create an AngularFire reference to the data
  var sync = $firebase(ref);

  // download the data into a local array
  $scope.list = sync.$asArray();
  
  // Add the item to the saved array
  $scope.add = function(item) {
    // Ignore if no input
    if ( !$scope.category.newItem || $scope.category.newItem == '') { return; }

    $scope.list.$add({ name: item, timestamp: new Date().getTime()});
    $scope.category.newItem = '';
  }

  // Delete the item from the array
  $scope.delete = function(item) {
    $scope.list.$remove(item);
  }
  
  // Update the item
  $scope.edit = function(item) {
    item.timestamp = new Date().getTime();
    // console.log(item);
    if ( !item.name || item.name == '') { return; }
    $scope.list.$save(item);
    var item = {};
  }

  // Archive the item
  $scope.archive = function(item) {
    item.archive = true;
    $scope.list.$save(item);
    var item = {};
  }
  
    // Unarchive the item
  $scope.unArchive = function(item) {
      delete item.archive;
      $scope.list.$save(item);
      var item={};
  }

  // Toggle the list between Archived/Unarchived
  $scope.toggleArchive = function() {
    if (!$scope.toggle) {
      $scope.toggle = true;
    }
    else {
      $scope.toggle = undefined;
    }
  }

});
