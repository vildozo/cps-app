angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('LaggingSkillsCtrl', function($scope, LaggingSkills, $cordovaSQLite, $state, $ionicListDelegate) {
  //$scope.laggingSkills = getLaggingSkills($cordovaSQLite);
  $scope.laggingSkills = LaggingSkills.all();
  $scope.checkLaggingSkill = function(laggingskillId){
    //updateLaggingSkill($cordovaSQLite, [laggingskillId]);
    LaggingSkills.check(laggingskillId);
    $state.go('app.laggingSkills');
    $ionicListDelegate.closeOptionButtons();
  };
  $scope.uncheckLaggingSkill = function(laggingskillId){
    //updateLaggingSkill($cordovaSQLite, [laggingskillId]);
    LaggingSkills.uncheck(laggingskillId);
    $state.go('app.laggingSkills');
    $ionicListDelegate.closeOptionButtons();
  };
})

.controller('HelpCategoryCtrl', function($scope, $stateParams) {
  $scope.params = $stateParams;
})

.controller('HelpCategoryTopicsCtrl', function($scope, HelpCategoriesStep1, $stateParams){
  $scope.category = HelpCategoriesStep1.get($stateParams.id_category);
})

.controller('HelpCategoryCtrl', function($scope, HelpCategoriesStep1) {
  $scope.helpCategories = HelpCategoriesStep1.all();
})

.controller('HelpTopicContentCtrl', function($scope, HelpCategoriesStep1, $stateParams) {
  $scope.topic = HelpCategoriesStep1.getContent($stateParams.id_category, $stateParams.id_topic);
})

.controller('DefineTheProblemCtrl', function($scope, $stateParams) {
  $scope.unsolvedProblem = {
      description: "",
      id:$stateParams.id_unsolved
  };
})

.controller('UnsolvedProblemCtrl', function($scope, UnsolvedProblems, $cordovaSQLite, $state, $ionicActionSheet,$ionicListDelegate, $ionicPopup) {
  $scope.unsolvedProblems = getUnsolvedProblems($cordovaSQLite);
  $scope.shouldShowReorder = false;
  $scope.moveItem = function(unsolvedProblem, fromIndex, toIndex) {
    var timestampAuxiliary = $scope.unsolvedProblems[fromIndex].sort_timestamp;
    $scope.unsolvedProblems[fromIndex].sort_timestamp = $scope.unsolvedProblems[toIndex].sort_timestamp;
    $scope.unsolvedProblems[toIndex].sort_timestamp = timestampAuxiliary;
    updateUnsolvedProblem($cordovaSQLite, [$scope.unsolvedProblems[fromIndex].description, $scope.unsolvedProblems[fromIndex].sort_timestamp, $scope.unsolvedProblems[fromIndex].id]);
    updateUnsolvedProblem($cordovaSQLite, [$scope.unsolvedProblems[toIndex].description, $scope.unsolvedProblems[toIndex].sort_timestamp, $scope.unsolvedProblems[toIndex].id]);
    $scope.unsolvedProblems.splice(fromIndex, 1);
    $scope.unsolvedProblems.splice(toIndex, 0, unsolvedProblem);
    $scope.unsolvedProblems.sort(function (a, b) {
      return (a.sort_timestamp > b.sort_timestamp ? 1 : -1);
    });
  };
  $scope.createUnsolvedProblem = function() {
    if (!inputFieldIsEmpty($scope.unsolvedProblem.description)) {
      saveUnsolvedProblem($cordovaSQLite,$scope.unsolvedProblem);
      $scope.unsolvedProblem = {};
      $scope.unsolvedProblems = getUnsolvedProblems($cordovaSQLite);
    }
  };

  $scope.openUnsolvedProblem = function(unsolvedProblem){
    $state.go('app.showUnsolvedProblem',{ unsolvedProblemId: unsolvedProblem.id});
  };

  $scope.openStep2 = function(unsolvedProblem){
    $state.go('app.defineTheProblem',{ itemId: unsolvedProblem.id});
  };

  $scope.showActionsheet = function(unsolvedProblem) {

      $ionicActionSheet.show({
        buttons: [
          { text: 'Step 1: Empathy Step' },
          { text: 'Step 2: Define the problem' },
          { text: 'Step 3: Invitation step' }
        ],
        destructiveText: 'Delete',
        cancelText: 'Cancel',
        cancel: function() {
          $ionicListDelegate.closeOptionButtons();
        },
        buttonClicked: function(index) {
          if(index === 0){
            $scope.openUnsolvedProblem(unsolvedProblem);
          }
          if(index == 1){
            $scope.openStep2(unsolvedProblem);
          }
          return true;
        },
        destructiveButtonClicked: function() {
          $scope.showConfirm(unsolvedProblem);
          $ionicListDelegate.closeOptionButtons();

          return true;
        }
      });
    };

    $scope.delete = function(item) {
        var query = "DELETE FROM unsolved_problems where id = ?";
        console.log(item);
        $cordovaSQLite.execute(db, query, [item.id]).then(function(res) {
            $scope.unsolvedProblems.splice($scope.unsolvedProblems.indexOf(item), 1);
        }, function (err) {
            console.error(err);
        });
     };

     $scope.showConfirm = function(item) {
       var confirmPopup = $ionicPopup.confirm({
         title: 'Delete Unsolved Problem',
         template: 'Are you sure you want to delete this unsolved problem?'
       });

       confirmPopup.then(function(res) {
         if(res) {
           $scope.delete(item);
         }
       });
     };

})

.controller('DeleteUnsolvedProblemCtrl', function($scope, $cordovaSQLite, $ionicPopup){

  $scope.delete = function(item) {
    var query = "DELETE FROM unsolved_problems where id = ?";
    $cordovaSQLite.execute(db, query, [item.id]).then(function(res) {
        $scope.unsolvedProblems.splice($scope.unsolvedProblems.indexOf(item), 1);
    }, function (err) {
        console.error(err);
    });
 };

 $scope.showConfirm = function(item) {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Delete Unsolved Problem',
     template: 'Are you sure you want to delete this unsolved problem?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       $scope.delete(item);
     }
   });
 };
})

.controller('ChildsConcernsCtrl', function($scope, $cordovaSQLite, $state, $ionicModal, $ionicPopup, $stateParams){
  $scope.childsConcern = {
    description: ""
  };
  $scope.updateChildsConcerns = function(){
    $scope.childsConcerns = getChildsConcern($cordovaSQLite, $scope.unsolvedProblem.id);
  };

  $scope.findUnsolvedProblem = function(unsolvedProblem) {
    var query ="SELECT * FROM unsolved_problems where id = ?;";
    $cordovaSQLite.execute(db,query,[unsolvedProblem.id]).then(function(result){
      $scope.itemf = result.rows.item(0);
      $scope.unsolvedProblem.description = $scope.itemf.description;
    });
    $scope.unsolvedProblem = {};
    $scope.unsolvedProblem.id = $stateParams.unsolvedProblemId;
  };

  $ionicModal.fromTemplateUrl('create-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalCreate = modal;
  });
  $scope.openModal = function() {
    $scope.modalCreate.show();
  };
  $scope.closeModal = function() {
    $scope.modalCreate.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modalCreate.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
  $ionicModal.fromTemplateUrl('edit-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalEdit = modal;
  });
  $scope.openModalEdit = function() {
    $scope.modalEdit.show();
  };
  $scope.closeModalEdit = function() {
    $scope.modalEdit.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modalEdit.remove();
  });
  // Execute action on hide modal
  $scope.$on('modalEdit.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modalEdit.removed', function() {
    // Execute action
  });

  $scope.editChildsConcern = function(childsConcern){
    $scope.childsConcerntoEdit = childsConcern;
    $scope.editableChildsConcern = {
      description: childsConcern.description
    };
    $scope.openModalEdit();
  };

  $scope.createChildsConcern = function(){
    if (!inputFieldIsEmpty($scope.childsConcern.description))
    {
      console.log($stateParams.unsolvedProblemId);
      saveChildsConcern($cordovaSQLite,$scope.childsConcern.description, $stateParams.unsolvedProblemId);
      $scope.modalCreate.hide();
      $state.go('app.showUnsolvedProblem',{ itemId: $stateParams.unsolvedProblemId});
      $scope.childsConcern.description = "";
      $scope.childsConcerns= getChildsConcern($cordovaSQLite,$stateParams.unsolvedProblemId);
    }
  };

  $scope.updateChildsConcern = function(){
    if (!inputFieldIsEmpty($scope.editableChildsConcern.description)) {
      updateChildsConcern($cordovaSQLite, [$scope.editableChildsConcern.description,$scope.childsConcerntoEdit.id]);
      $scope.modalEdit.hide();
      $scope.childsConcerntoEdit = {};
      $scope.childsConcerns= getChildsConcern($cordovaSQLite,$stateParams.unsolvedProblemId);
    }
    else {
      $scope.emptyInput = true;
    }
  };
  $scope.deleteChildsConcern = function(item) {
    var query = "DELETE FROM childs_concerns where id = ?";
    $cordovaSQLite.execute(db, query, [item.id]).then(function(res) {
        $scope.childsConcerns.splice($scope.childsConcerns.indexOf(item), 1);
    }, function (err) {
        console.error(err);
    });
 };

 $scope.showConfirmChildsConcern = function(item) {
   var confirmPopup = $ionicPopup.confirm({
     title: "Delete Child's Concern",
     template: "Are you sure you want to delete this child's concern?"
   });

   confirmPopup.then(function(res) {
     if(res) {
       $scope.deleteChildsConcern(item);
     }
   });
 };
})

.controller('EditUnsolvedProblemCtrl', function($scope, $cordovaSQLite, $state, $ionicModal, $ionicPopup, $stateParams){
  $scope.unsolvedProblem = {
      description: "",
      id:$stateParams.unsolvedProblemId
    };
  $scope.emptyInput = false;

  $scope.find = function(unsolvedProblem) {
    var query ="SELECT * FROM unsolved_problems where id = ?";
    $cordovaSQLite.execute(db,query,[$scope.unsolvedProblem.id]).then(function(result){
      $scope.itemf = result.rows.item(0);
      $scope.unsolvedProblem.description = $scope.itemf.description;
    });
  };

  $scope.updateUnsolvedProblem = function(){
    if (!inputFieldIsEmpty($scope.unsolvedProblem.description)) {
      updateUnsolvedProblem($cordovaSQLite, [$scope.unsolvedProblem.description,$scope.unsolvedProblem.id]);
      $state.go('app.newUnsolvedProblem');
    }
    else {
      $scope.emptyInput = true;
    }
  };

});

// OTHER FUNCTIONS

function getUnsolvedProblems(cordovaSQLite) {
  var unsolved_problems = [];
  var query ="SELECT * FROM unsolved_problems ORDER BY sort_timestamp";
  cordovaSQLite.execute(db,query).then(function(result) {
    var rows = result.rows;
    if(rows.length) {
      for(var i=0; i < rows.length; i++){
        unsolved_problems.push(rows.item(i));
      }
    }
    },function(err){
      console.log(err.message);
    });
  return unsolved_problems;
}

function getLaggingSkills(cordovaSQLite){
  var lagging_skills = [];
  var query ="SELECT * FROM lagging_skills ORDER BY id";
  cordovaSQLite.execute(db,query).then(function(result) {
    var rows = result.rows;
    if(rows.length) {
      for(var i=0; i < rows.length; i++){
        lagging_skills.push(rows.item(i));
      }
    }
    },function(err){
      console.log(err.message);
    });
  return lagging_skills;
}
function inputFieldIsEmpty(description) {
    return description.length === 0;
}

function saveUnsolvedProblem(cordovaSQLite,unsolvedProblem){
  var query ="INSERT INTO unsolved_problems(description,solved) VALUES (?,?)";
  cordovaSQLite.execute(db,query,[unsolvedProblem.description,0]);
}

function saveChildsConcern(cordovaSQLite,childsConcern,unsolvedProblemId){
  var query ="INSERT INTO childs_concerns(description,unsolved_problem_id) VALUES (?,?)";
  cordovaSQLite.execute(db,query,[childsConcern,unsolvedProblemId]);
}

function getChildsConcern(cordovaSQLite,unsolvedProblemId){
  var childs_concerns = [];
  var query ="SELECT * FROM childs_concerns WHERE unsolved_problem_id = ?";
  cordovaSQLite.execute(db,query,[unsolvedProblemId]).then(function(result) {
    var rows = result.rows;
    if(rows.length) {
      for(var i=0; i < rows.length; i++){
        childs_concerns.push(rows.item(i));
      }
    }
    },function(err){
      console.log(err.message);
    });
  return childs_concerns;
}

function updateUnsolvedProblem($cordovaSQLite, params){
  var query = "";
  if(params.length > 2){
    query = "UPDATE unsolved_problems SET description = ?, sort_timestamp = ? where id = ?";
  }
  else{
    query = "UPDATE unsolved_problems SET description = ? where id = ?";
  }
  $cordovaSQLite.execute(db, query, params);
}

function updateChildsConcern($cordovaSQLite, params){
  var query = "";
  console.log(params);
  if(params.length > 2){
    query = "UPDATE childs_concerns SET description = ?, sort_timestamp = ? where id = ?";
  }
  else{
    query = "UPDATE childs_concerns SET description = ? where id = ?";
  }
  $cordovaSQLite.execute(db, query, params);
}

function updateLaggingSkill($cordovaSQLite, params){
  var query = "UPDATE lagging_skills SET checked = 1 where id = ?";
  $cordovaSQLite.execute(db,query,params);
}
