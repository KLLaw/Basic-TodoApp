// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('ToDo', ['ionic', 'LocalStorageModule'])

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.config(function(localStorageServiceProvider){
  //set prefix from ls.task to Todo.task
  localStorageServiceProvider
    .setPrefix('ToDo');
});

app.controller('main', function ($scope, $ionicModal, localStorageService, $ionicPopup) { //store the entities name in a variable var taskData = 'task'


$scope.CurrentDate = new Date();

var taskData = 'task';  //store the entities name in a variable
$scope.tasks = [];  //initialize the task scope with empty array
$scope.task = {}; //initialize the task scope with empty object
$scope.sortAttribute = '$index';

//configure the ionic modal before use
$ionicModal.fromTemplateUrl('new-task-modal.html', {
  scope: $scope,
  animation: 'slide-in-up'
}).then(function (modal) {
  $scope.newTaskModal = modal;
});

$scope.openTaskModal = function(){
  $scope.newTaskModal.show();
};

$scope.closeTaskModal = function(){
  $scope.newTaskModal.hide();
};

$scope.sortTasks = function(){
  if($scope.sortAttribute == '$index'){
    $scope.sortAttribute = 'expDate';
  }
  else if($scope.sortAttribute == 'expDate'){
    $scope.sortAttribute = '-expDate';
  }
  else if($scope.sortAttribute == '-expDate'){
    $scope.sortAttribute = '$index';
  }
}

$scope.getTasks = function(){
  //fetches task from local storage
  if(localStorageService.get(taskData)){
    $scope.tasks = localStorageService.get(taskData);
    for(var i = 0; i < $scope.tasks.length; i++){
      var task = $scope.tasks[i];
      var taskExpDate = new Date($scope.tasks[i].expDate);
      var today = $scope.CurrentDate;
      var key = 'ToDo.task';
      if(taskExpDate <= today){
        task.due = true;
        // localStorage.setItem(key, JSON.stringify($scope.tasks));
      }
      task.id = i;
      localStorage.setItem(key, JSON.stringify($scope.tasks));
    }
  }
  else{
    $scope.tasks = [];
  }
  $scope.$broadcast('scroll.refreshComplete');
  console.log($scope.tasks);
};

$scope.createTask = function(){
  //creates a new task
  $scope.task.id = $scope.tasks.length !== 0 ? (($scope.tasks[$scope.tasks.length -1].id) + 1) : 0;
  $scope.tasks.push($scope.task);
  localStorageService.set(taskData, $scope.tasks);
  $scope.task = {};

  //close new task modal
  $scope.newTaskModal.hide();
};

$scope.createQuickTask = function(){
  if($scope.task.title){
    $scope.task.id = $scope.tasks.length !== 0 ? (($scope.tasks[$scope.tasks.length -1].id) + 1) : 0;
    $scope.tasks.push($scope.task);
    localStorageService.set(taskData, $scope.tasks);
    $scope.task = {};
  }
}

$scope.removeTask = function(id){
  //removes a task
  var tasks = $scope.tasks;
  for(var i=0; i<tasks.length; i++){
        if(tasks[i].id == id){
            tasks.splice(i, 1); 
            break;
        }
  }
  localStorageService.set(taskData, $scope.tasks);

};

$scope.doFunction = function(){
  console.log($scope.tasks);
};

});
