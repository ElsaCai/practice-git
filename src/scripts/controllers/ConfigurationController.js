'use strict';

var app = angular.module('example');
app.controller('ConfigurationController', ['$scope', function($scope) {
  //toogle switch
  var s_result = 'Yes';
  $scope.formElem = {
    checkbox: true
  };

  $scope.toggleChange = function () {
    if($scope.formElem.checkbox) {
      s_result = 'Yes';
    } else {
      s_result = 'No';
    }
  };

  //Name.
  $scope.FirstName = '';
	$scope.LastName = '';
  //Color
  $scope.colors = [{name:'Red'}, {name:'Orange'}, {name:'Yellow'}, {name:'Green'}, {name:'Blue'}, {name:'Purple'}, {name:'Black'}];
  $scope.colorsObj = {};

  $scope.citys = [{name:'Chicago'}, {name:'Seattle'}, {name:'Los Angeles'}];
  $scope.citysObj = {};

  $scope.getAllSelected = function() {
    //Clear
    $scope.colorNameArray = [];
    $scope.cityNameArray = [];
    angular.forEach($scope.citysObj, function(key, value){
      if(key) {
        $scope.cityNameArray.push(value);
      }
    });
    $scope.r_cityNameArray = $scope.cityNameArray.toString();

    angular.forEach($scope.colorsObj, function(key, value){
      if(key) {
        $scope.colorNameArray.push(value);
      }
    });
    $scope.r_colorNameArray = $scope.colorNameArray.toString();

    if($scope.FirstName) {
      $scope.fname = $scope.FirstName;
    } else {
      $scope.showMsgs = true;
      return;
    }
		if($scope.LastName) {
			$scope.lname = $scope.LastName;
		}else {
      $scope.showMsgs = true;
      return;
    }
    $scope.r_switch = s_result;
  };

  $scope.reset = function(){
    $scope.FirstName = '';
    $scope.LastName = '';
    $scope.colorsObj = {};
    $scope.citysObj = {};
  };
}]);
