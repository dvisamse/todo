// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


angular.module('todo', ['ionic'])
.factory('ProjectsFactory',function(){
   var factory ={

    save:function(projects){
     window.localStorage['projects']=angular.toJson(projects);
    },
    newProject:function(projectTitle){
      return {
        title:projectTitle,
        tasks:[]
      };
    },
    all:function() {
      var projectString = window.localStorage['projects'];
      if(projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
   getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  };
  return factory;
  })
.controller('TodoCtrl',function($scope,$timeout,$ionicModal,ProjectsFactory,$ionicSideMenuDelegate){
  //--------------------TASKS-------------------------
  // Create and Load the modal
  $ionicModal.fromTemplateUrl('new-task.html',function(modal){
   $scope.taskModal=modal;
   },
   {
    scope:$scope,
    animation:'slide-in-up'
   });
  // Function called when the form is submitted
  $scope.createTask = function(task) {
    if(!$scope.activeProject || !task) {
      return;
    }
    $scope.activeProject.tasks.push({
      title: task.title
    });
    $scope.taskModal.hide();

    // Inefficient, but save all the projects
    ProjectsFactory.save($scope.projects);

    task.title = "";
  };

  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  $scope.cancelNewTask = function() {
    $scope.taskModal.hide();
  }
  //----------------PROJECTS------------------------------

  //Load or initialise projects
  $scope.projects=ProjectsFactory.all();
    // Grab the last active, or the first project
  $scope.activeProject = $scope.projects[ProjectsFactory.getLastActiveIndex()];

  // A utility function for creating a new project
  // with the given projectTitle
  var createProject = function(projectTitle) {
    var newProject = ProjectsFactory.newProject(projectTitle);
    $scope.projects.push(newProject);
    ProjectsFactory.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
  };

  $scope.newProject=function(){
   var projectTitle=prompt('Project Name');//Question - Is this JS or Angular JS??
   if(projectTitle){
    createProject(projectTitle);
   }

  };
  $scope.selectProject=function(project,index){
    $scope.activeProject=project;
    ProjectsFactory.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };
  
  // Try to create the first project, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if($scope.projects.length == 0) {
      while(true) {
        var projectTitle = prompt('Your first project title:');
        if(projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
  });

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

});