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

.controller('AdultConcernsCrtl', function($scope, $cordovaSQLite, $state, $ionicModal, $ionicPopup, $stateParams){

  $scope.adultsConcern = { description: ""};
  $scope.adultsConcerns = getAdultConcerns($cordovaSQLite, $stateParams.unsolvedProblemId);

  $scope.findChildConcern = function() {
    var query ="SELECT * FROM childs_concerns where id = ?";
    $cordovaSQLite.execute(db,query,[$stateParams.unsolvedProblemId])
      .then( function(result) {
        $scope.childConcern = result.rows.item(0);
    });
  };
  $scope.findUnsolvedProblem = function() {
    var query =" SELECT * FROM childs_concerns,unsolved_problems where unsolved_problems.id = childs_concerns.unsolved_problem_id AND childs_concerns.id = ? ";
    $cordovaSQLite.execute(db,query,[$stateParams.unsolvedProblemId])
      .then( function(result) {
        $scope.unsolvedProblem = result.rows.item(0);
    },function(error){
      console.log(error);
    });
  };
  $scope.createAdultsConcern = function(){
    if (!inputFieldIsEmpty($scope.adultsConcern.description)) {
      saveAdultsConcern($cordovaSQLite,$scope.adultsConcern.description, $stateParams.unsolvedProblemId);
      $scope.modalCreate.hide();
      $state.go('app.defineTheProblem');
      $scope.adultsConcern.description = "";
      $scope.adultsConcerns= getAdultConcerns($cordovaSQLite,$stateParams.unsolvedProblemId);
    }
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
})

.controller('ChildsConcernsCtrl', function($scope, $cordovaSQLite, $state, $ionicModal, $ionicPopup, $ionicListDelegate, $stateParams){
  $scope.childsConcern = {
    description: ""
  };
  // $scope.childsConcerns = getChildsConcern($cordovaSQLite, $scope.unsolvedProblem.id);

  $scope.unsolvedProblem = {
    description: '',
    id: $stateParams.unsolvedProblemId
  };
  $scope.shouldShowReorder = false;
  $scope.moveItem = function(childsConcern, fromIndex, toIndex) {
    var indexOrder = $scope.childsConcerns[fromIndex].unsolved_order;
    $scope.childsConcerns[fromIndex].unsolved_order = $scope.childsConcerns[toIndex].unsolved_order;
    $scope.childsConcerns[toIndex].unsolved_order = indexOrder;
    updateChildsConcernOrder($cordovaSQLite, [toIndex, $scope.childsConcerns[fromIndex].id]);
    updateChildsConcernOrder($cordovaSQLite, [fromIndex, $scope.childsConcerns[toIndex].id]);
    $scope.childsConcerns.splice(fromIndex, 1);
    $scope.childsConcerns.splice(toIndex, 0, childsConcern);
  };
  $scope.updateChildsConcerns = function(){
    $scope.childsConcerns = getChildsConcern($cordovaSQLite, $stateParams.unsolvedProblemId);
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

  $scope.adultsConcerns = getAdultConcerns($cordovaSQLite, $scope.unsolvedProblem.id);

  $scope.verifyToGoToStep2 = function() {
    if($scope.adultsConcerns.length === 0){
      var confirmPopup = $ionicPopup.confirm({
        title: 'Going to Step 2: Define the problem',
        template: "Did you drill enough to get all your child's concerns?",
        cancelText: "No, keep drilling",
        okText: "Yes, I'm sure"
      });

      confirmPopup.then(function(res) {
        if(res) {
          console.log($scope.unsolvedProblem);
          $state.go('app.defineTheProblem',{ unsolvedProblemId: $stateParams.unsolvedProblemId});
        }
      });
    }
    else {
      $state.go('app.defineTheProblem',{ unsolvedProblemId: $stateParams.unsolvedProblemId});
    }
  };

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
      saveChildsConcern($cordovaSQLite,$scope.childsConcern.description, $stateParams.unsolvedProblemId, $scope.childsConcerns.length);
      $scope.modalCreate.hide();
      $state.go('app.showUnsolvedProblem',{ unsolvedProblemId: $stateParams.unsolvedProblemId});
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

.controller('InvitationCtrl',function($scope, $cordovaSQLite, $state, $stateParams, $ionicModal){

  console.log($scope);
  $scope.solution = { unsolvedProblemId:$stateParams.unsolvedProblemId };
  $scope.solutions = getSolutions($cordovaSQLite, $stateParams.unsolvedProblemId);
  $scope.initialSetUp = function(){
    findUnsolvedProblem();
    findChildsConcerns();
    findAdultsConcerns();
  };
  $scope.createSolution = function() {
    if (!inputFieldIsEmpty($scope.solution.description)) {
      saveSolution($cordovaSQLite,$scope.solution);
      $scope.closeModal();
      $scope.solutions = getSolutions($cordovaSQLite, $stateParams.unsolvedProblemId);
    }
  };
  $scope.updateSolution = function(){
    if (!inputFieldIsEmpty($scope.editableSolution.description)) {
      updateSolution($cordovaSQLite,$scope.editableSolution);
      $scope.modalEdit.hide();
      $scope.solutionEdit = {};
      $scope.solutions = getSolutions($cordovaSQLite,$stateParams.unsolvedProblemId);
    }
    else {
      $scope.emptyInput = true;
    }
  };
  $scope.editSolution = function(solution){
    $scope.solutionEdit = solution;
    $scope.editableSolution = {
      description: solution.description,
      id: solution.id
    };
    $scope.openModalEdit();
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
  function findUnsolvedProblem() {
    // var query ="SELECT u.id, u.description FROM unsolved_problems AS u, childs_concerns AS c, adults_concerns AS a WHERE u.id = c.unsolved_problem_id AND c.id = a.child_concern_id AND a.id = ?";
    var query ="SELECT * FROM unsolved_problems WHERE id = ?";
    $cordovaSQLite.execute(db,query,[$stateParams.unsolvedProblemId])
      .then( function(result) {
        $scope.unsolvedProblem = result.rows.item(0);
    },function(error){console.log(error);});
  }
  function findChildsConcerns() {
    $scope.childsConcerns = getChildsConcern($cordovaSQLite,$stateParams.unsolvedProblemId);
  }
  function findAdultsConcerns() {
    $scope.adultsConcerns = getAdultConcerns($cordovaSQLite,$stateParams.unsolvedProblemId);
  }
})

.controller('SolutionsCtrl', function($scope, $cordovaSQLite, $state, $stateParams) {
  $scope.solution = {
      description: ""
    };
    $scope.childsConcerns =getChildsConcern($cordovaSQLite);
    $scope.adultsConcerns =getAdultsConcern($cordovaSQLite);
    $scope.unsolvedProblem = {
        description: "",
        id:$stateParams.id_unsolved
    };
  $scope.solutions = getSolutions($cordovaSQLite);


  $scope.createSolution = function() {
    if (!inputFieldIsEmpty($scope.solution.description)) {
      saveSolution($cordovaSQLite,$scope.solution);
      $scope.solution = {};
      $scope.solutions = getSolutions($cordovaSQLite);
    }
  };

  $scope.updateSolution = function() {
    if (!inputFieldIsEmpty($scope.editableSolution.description)) {
      updateSolution($cordovaSQLite, [$scope.editableSolution.description,$scope.solution.id]);
      $state.go('app.newSolution');
    }
  };

  $scope.find = function() {
    var query ="SELECT * FROM solutions where id = ?";
    $cordovaSQLite.execute(db,query,[$stateParams.solutionId])
      .then( function(result) {
        $scope.solution = result.rows.item(0);
        $scope.editableSolution = $scope.solution;
    });
  };
});

// OTHER FUNCTIONS

function getAdultConcernById(cordovaSQLite,adultConcernId){
  var query ="SELECT * FROM adults_concerns where id = ?";
  $cordovaSQLite.execute(db,query,[adultConcernId])
    .then( function(result,callback) {
      callback(result.rows.item(0));
  });
}

function getUnsolvedProblems(cordovaSQLite) {
  var unsolved_problems = [];
  var query ="SELECT * FROM unsolved_problems ORDER BY unsolved_order";
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

function getSolutions(cordovaSQLite,unsolvedProblemId) {
  var solutions = [];
  var query ="SELECT * FROM solutions WHERE unsolved_problem_id = ?";
  cordovaSQLite.execute(db,query,[unsolvedProblemId]).then(function(result) {
    var rows = result.rows;
    if(rows.length) {
      for(var i=0; i < rows.length; i++){
        solutions.push(rows.item(i));
      }
    }
  },function(err){console.log(err.message);});
  return solutions;
}

function inputFieldIsEmpty(description) {
    return description.length === 0;
}

function saveUnsolvedProblem(cordovaSQLite, unsolvedProblem){
  var query = "INSERT INTO unsolved_problems(description, solved, unsolved_order) VALUES (?,?,?)";
  cordovaSQLite.execute(db, query, [unsolvedProblem.description, 0, unsolvedProblem.unsolved_order]);
}

function saveChildsConcern(cordovaSQLite,childsConcern,unsolvedProblemId,orderId){
  var query ="INSERT INTO childs_concerns(description,unsolved_problem_id,unsolved_order) VALUES (?,?,?)";
  cordovaSQLite.execute(db,query,[childsConcern,unsolvedProblemId,orderId]);
}

function saveAdultsConcern(cordovaSQLite,adultsConcern,childConcernId){
  var query ="INSERT INTO adults_concerns(description,unsolved_problem_id) VALUES (?,?)";
  cordovaSQLite.execute(db,query,[adultsConcern,childConcernId]);
}

function saveSolution(cordovaSQLite,solution){
  var query ="INSERT INTO solutions(description,unsolved_problem_id) VALUES (?,?)";
  console.log(cordovaSQLite.execute(db,query,[solution.description,solution.unsolvedProblemId]));
}

function getChildsConcern(cordovaSQLite,unsolvedProblemId){
  var childs_concerns = [];
  var query ="SELECT * FROM childs_concerns WHERE unsolved_problem_id = ? ORDER BY unsolved_order";
  // var query ="SELECT * FROM childs_concerns WHERE unsolved_problem_id = ? ";
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

function getAdultConcerns(cordovaSQLite,unsolvedProblemId){
  var adults_concerns = [];
  var query ="SELECT * FROM adults_concerns WHERE unsolved_problem_id = ?";
  cordovaSQLite.execute(db,query,[unsolvedProblemId]).then(function(result) {
    var rows = result.rows;
    if(rows.length) {
      for(var i=0; i < rows.length; i++){
        adults_concerns.push(rows.item(i));
      }
    }
    },function(err){
      console.log(err.message);
    });
  return adults_concerns;
}
function updateUnsolvedProblem($cordovaSQLite, params){
  var query = "";
  if(params.length > 2){
    query = "UPDATE unsolved_problems SET description = ?, unsolved_order = ? where id = ?";
  }
  else{
    query = "UPDATE unsolved_problems SET description = ? where id = ?";
  }
  $cordovaSQLite.execute(db, query, params);
}

function updateSolution($cordovaSQLite, solution){
  var query = "UPDATE solutions SET description = ? where id = ?";
  $cordovaSQLite.execute(db, query, [solution.description, solution.id]);
}

function updateChildsConcernOrder($cordovaSQLite,params){
  var query = "";
  query = "UPDATE childs_concerns SET unsolved_order = ? where id = ?";
  $cordovaSQLite.execute(db, query, params);
}
function updateChildsConcern($cordovaSQLite, params){
  var query = "";
  query = "UPDATE childs_concerns SET description = ? where id = ?";
  return $cordovaSQLite.execute(db, query, params);
}

function updateLaggingSkill($cordovaSQLite, params){
  var query = "UPDATE lagging_skills SET checked = 1 where id = ?";
  $cordovaSQLite.execute(db,query,params);
}
