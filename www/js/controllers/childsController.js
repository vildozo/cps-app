angular.module('starter.controllers')
  .controller('ChildsCtrl', function($scope, $cordovaSQLite, $state, $ionicActionSheet, $ionicListDelegate, $ionicPopup, $ionicModal, $stateParams, $filter, $timeout) {
    $scope.childs = getChilds($cordovaSQLite);
    $scope.child = {};
    $scope.child.first_name="";
    $scope.child.gender = "Female";
    $scope.child.birthday = new Date();
    $ionicModal.fromTemplateUrl('templates/child/create-child-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalCreate = modal;
    });
    $scope.openModalCreate = function() {
      $scope.modalCreate.show();
    };
    $scope.closeModalCreate = function() {
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

    $scope.convertStringToDate = function(dateToConvert){
        return new Date(dateToConvert);
    };


    $scope.createChild = function(){
      if (!inputFieldIsEmpty($scope.child.first_name)) {
        saveChild($cordovaSQLite,$scope.child);
        $scope.child.first_name = "";
        $scope.child.gender = "Female";
        $scope.child.birthday = new Date();
        $scope.closeModalCreate();
        if($scope.childs.length !== 0){
          createLaggingSkills($cordovaSQLite, $scope.childs[$scope.childs.length-1].id+1);
          activateChild($cordovaSQLite,[$scope.childs[$scope.childs.length-1].id+1]);
          deactivateChildsBut($cordovaSQLite,[$scope.childs[$scope.childs.length-1].id+1]);
        }else{
          createLaggingSkills($cordovaSQLite, [1]);
          activateChild($cordovaSQLite,[1]);
          deactivateChildsBut($cordovaSQLite,[1]);
        }
        $scope.childs = getChilds($cordovaSQLite);
      }
    };

    $scope.activateChild = function(child){
      console.log("hola");
    };

    $scope.showActionsheet = function(child) {
      $ionicActionSheet.show({
        buttons: [
          { text: 'Edit child' }
        ],
        cancelText: 'Cancel',
        cancel: function() {
          $ionicListDelegate.closeOptionButtons();
        },
        destructiveText: 'Delete',
        destructiveButtonClicked: function() {
          $scope.showConfirm(child);
          return true;
        },
        buttonClicked: function(index) {

          if(index === 0){
            $scope.goToUnsolvedProblem(unsolvedProblem);
          }
          $ionicListDelegate.closeOptionButtons();

          return true;

        }
      });
    };
    $scope.activateChild = function(item){
      activateChild($cordovaSQLite,[item.id]);
      deactivateChildsBut($cordovaSQLite,[item.id]);
      $scope.childs = getChilds($cordovaSQLite);

    };
    $scope.deleteChild = function(item) {
      var query = "DELETE FROM childs where id = ?";
      $cordovaSQLite.execute(db, query, [item.id]).then(function(res) {
          $scope.childs.splice($scope.childs.indexOf(item), 1);
      }, function (err) {
          console.error(err);
      });
    };
    $scope.showConfirm = function(item) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete Child',
        template: 'Are you sure you want to delete this child?'
      });

      confirmPopup.then(function(res) {
       if(res) {
        $scope.deleteChild(item);
       }
      });
    };

});

function createLaggingSkills (cordovaSQLite, child_id){
  var sqlLaggingSkills = [
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ( "Difficulty handling transitions, shifting from one mindset or task to another",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ( "Difficulty doing things in a logical sequence or prescribed order",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ( "Difficulty persisting on challenging or tedious task",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ( "Poor sense of time",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ( "Difficulty maintaining focus",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ( "Difficulty considering the likely outcomes or consequences of actions (impulsive)",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ( "Difficulty considering a range of solutions to a problem",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ( "Difficulty expressing concerns, needs, or thoughts in word",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ( "Difficulty managing emotional response to frustration so as to think rationally",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ("Chronic irritability and/or anxiety significantly impede capacity for problem-solving or heighten frustration",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ("Difficulty seeing “grays”/concrete, literal, black & white, thinking",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ("Difficulty deviating from rules, routines",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ("Difficulty handling unpredictability, ambiguity, uncertainty, novelty",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ("Difficulty shifting from original idea, plan, or solut",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ("Difficulty taking into account situational factors that would suggest the need to adjust a plan of action",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ("Difficulty shifting from original idea, plan, or solution",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ("Difficulty taking into account situational factors that would suggest the need to adjust a plan of action",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ("Inflexible, inaccurate interpretations/cognitive distortions or biases (e.g., “Everyone’s out to get me,” “Nobody likes me,” “You always blame me, “It’s not fair,” “I’m stupid”)",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ("Difficulty attending to or accurately interpreting social cues/poor perception of social nuances",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ("Difficulty starting conversations, entering groups, connecting with people/lacking other basic social skills",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ("Difficulty seeking attention in appropriate way",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ("Difficulty appreciating how his/her behavior is affecting others",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ("Difficulty empathizing with others, appreciating another person’s perspective or point of view",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ("Difficulty appreciating how s/he is coming across or being perceived by others",0,?)',
    'INSERT INTO lagging_skills (description,checked,child_id) VALUES ("Sensory/motor difficulties",0,?)'];
    sqlLaggingSkills.forEach(function(item){
      cordovaSQLite.execute(db,item,[child_id]);
    });
}

function activateChild($cordovaSQLite,params){
  var query = "UPDATE childs SET active = 1 where id = ?";
  $cordovaSQLite.execute(db,query,params);
}
function deactivateChild($cordovaSQLite,params){
  var query = "UPDATE childs SET active = 0 where id = ?";
  $cordovaSQLite.execute(db,query,params);
}

function deactivateChildsBut($cordovaSQLite,params){
  var query = "UPDATE childs SET active = 0 where id <> ?";
  $cordovaSQLite.execute(db,query,params);
}