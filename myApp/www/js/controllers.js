'use strict';

(function () {
	var app = angular.module('servicesapp.controllers', []) 

	app.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

	  // With the new view caching in Ionic, Controllers are only called
	  // when they are recreated or on app start, instead of every page change.
	  // To listen for when this page is active (for example, to refresh data),
	  // listen for the $ionicView.enter event:
	  //$scope.$on('$ionicView.enter', function(e) {
	  //});

	  // Form data for the login modal
	  $scope.loginData = {};

	  // Create the login modal that we will use later
	  /*$ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $scope
	  }).then(function(modal) {
		$scope.modal = modal;
	  });*/

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
	});

	app.controller('mainCtrl', 
		['$scope', '$http', 
		function ($scope, $http) {	
			$scope.tab = 'Калькулятор';
			
			$scope.isSelected = function(checkTab) {
				return this.tab === checkTab;
			};

			$scope.selectTab = function(setTab) {
				$scope.tab = setTab;
			}			
		}]
	)

	app.controller('servicesCtrl', 
		['$scope', '$http', '$log', 'calcService', 'localStorageService',
		function ($scope, $http, $log, calcService, localStorageService) {
			
		$scope.light = {
			"name": "Світло",
			"storage": "light_data", 
			"hist": "light_history", 
			"data": {
				"tariffs": [],
				"records": []
			}
		};
		$scope.gas = { 
			"name": "Газ",
			"storage": "gas_data",
			"hist": "gas_history", 
			"data": {
				"tariffs": [],
				"records": []
			}
		 };
		$scope.water = { 
			"name": "Вода",
			"storage": "water_data",
			"hist": "water_history", 
			"data": {
				"tariffs": [],
				"records": []
			}
		};
		
		$scope.tariff = {};		
		$scope.temp = {};			
		$scope.CURRENCY = "грн";		
		
		$scope.getTariffs = function (service) {
			//fetches tariffs from local storage
			if (localStorageService.get(service.storage)) {
				service.data.tariffs = localStorageService.get(service.storage);
			} else {
				service.data.tariffs = []; 
			}	
		}
		
		$scope.createTariff = function (service) {
			//creates a new tariff
			service.data.tariffs.push($scope.tariff);
			localStorageService.set(service.storage, service.data.tariffs);
			$scope.tariff = {};
		};

		$scope.removeTariff = function (service, index) {
			//removes a tariff
			service.data.tariffs.splice(index, 1);
			localStorageService.set(service.storage, service.data.tariffs);
		};
			
		$scope.saveTariff = function(service) {	
			//save a tariff		
			localStorageService.set(service.storage, service.data.tariffs); 
		}; 
		
		$scope.getRecords = function (service) {
			//fetches records from local storage			
			if (localStorageService.get(service.hist)) {
				service.data.records = localStorageService.get(service.hist);
			} else {
				service.data.records = [];
			}
		}
	   
		$scope.createRecord = function (service) {
			//creates a new record
			var date = new Date();
			$scope.record = {
				date: date,
				rate: $scope.temp.curr,
				payment: $scope.calculate(service)				
			}
			var lastDateInStorage = (service.data.records.length>0) ?
				new Date(service.data.records[(service.data.records.length)-1].date) :
				new Date(1);
			if (! (date.getMonth() == lastDateInStorage.getMonth() &&
				date.getFullYear() == lastDateInStorage.getFullYear())
			){
				service.data.records.push($scope.record);
				localStorageService.set(service.hist, service.data.records);
				$scope.record = {};
				$scope.prev = $scope.curr;
				$scope.curr = "";
				alert('збережено!');
			} else alert('вже сплачували цього місяця!');
		};		

		$scope.difference = function() {
			var difference = calcService.subtract(
				+$scope.temp.prev, +$scope.temp.curr
			);
			if (calcService.check([
					calcService.isNumber,
					calcService.greaterZero
				], [+$scope.temp.prev, 
					+$scope.temp.curr,
					difference
				]))
				return difference;
		};

		$scope.calculate = function(service) {
			if (calcService.check([
					calcService.greaterZero
				], [$scope.difference()]))
				return calcService.calculate(service.data.tariffs, $scope.difference()) + ' ' + $scope.CURRENCY;			
		};
		
		$scope.formatDate = function(date) {
			return calcService.formatDate(new Date(date));		
		};
		
		$scope.lastRate = function(service){
			return (service.data.records.length>0) ?
				service.data.records[(service.data.records.length)-1].rate : 0; 
		}
		
		$scope.clearAll = function() {
		   return localStorageService.clearAll();
		}

	}]); 

}) (); 