angular.module('starter.services').factory('AdultConcernFactory', function($cordovaSQLite) {

  function getAdultsConcerns(unsolvedProblemId,callback){
    var adultConcerns = [];
    var query ="SELECT * FROM adults_concerns WHERE unsolved_problem_id = ?";
    $cordovaSQLite.execute(db,query,[unsolvedProblemId]).then(function(result) {
      var rows = result.rows;
      if(rows.length) {
        for(var i=0; i < rows.length; i++){
          adultConcerns.push(rows.item(i));
        }
      }
      callback(adultConcerns);
      },function(err){
        console.log(err.message);
      });
  }

  function insertAdultsConcern(adultsConcern){
    var query ="INSERT INTO adults_concerns(description,unsolved_problem_id) VALUES (?,?)";
    $cordovaSQLite.execute(db,query,[adultsConcern.description,adultsConcern.unsolvedProblemId]);
  }

  function updateAdultsConcern(adultsConcern){
    var query = "";
    query = "UPDATE adults_concerns SET description = ? where id = ?";
    return $cordovaSQLite.execute(db, query, [adultsConcern.description, adultsConcern.id]);
  }

  function deleteAdultsConcern(adultsConcern, callback) {
    var query = "DELETE FROM adults_concerns where id = ?";
    $cordovaSQLite.execute(db, query, [adultsConcern.id]).then(function(res) {
        callback();
    }, function (err) {
        console.error(err);
    });
  }

  function findAdultsConcernPair(adultsConcernDescription, callback){
    var pair=null;
     var query ="SELECT * FROM pair_childConcerntoadultConcern WHERE description2 = ?";
     $cordovaSQLite.execute(db,query,[adultsConcernDescription]).then(function(result){
       var rows = result.rows;
          if(rows.length) {
          pair = result.rows.item(0);
        }
        callback(pair);

     },function(err){
       console.log(err.message);

     });

   }
   function updateAdultsConcernPair(adultsConcernDescription,pair){
     var query = "UPDATE pair_childConcerntoadultConcern SET description = ?, description2 = ? where id = ?";
     $cordovaSQLite.execute(db, query, [pair.description,adultsConcernDescription, pair.id]);
    }

  return {
    all: function(unsolvedProblemId,callback) {
      getAdultsConcerns(unsolvedProblemId,callback);
    },
    insert: function(adultsConcern) {
      insertAdultsConcern(adultsConcern);
    },
    update: function(adultsConcern) {
      updateAdultsConcern(adultsConcern);
    },
    findAdultsConcernPair: function(adultsConcernDescription,callback){
     findAdultsConcernPair(adultsConcernDescription, callback);
    },
    updateAdultsConcernPair: function(adultsConcernDescription,pair) {
       updateAdultsConcernPair(adultsConcernDescription,pair);
    },
    delete: function(adultsConcern, callback) {
      deleteAdultsConcern(adultsConcern, callback);
    }
  };
});
