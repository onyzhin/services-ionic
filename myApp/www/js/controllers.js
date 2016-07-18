'use strict';

(function () {
	var app = angular.module('servicesapp.controllers', []) 

	app.controller('mainCtrl', 
		['$scope', '$http', '$ionicPopup', '$timeout',
		function ($scope, $http, $ionicPopup, $timeout) {	
			
			//initial tab open
			$scope.tab = 'Calculator';
			
			$scope.isSelected = function(checkTab) {
				return this.tab === checkTab;
			};

			$scope.selectTab = function(setTab) {
				$scope.tab = setTab;
			}			
		}]
	)

	app.controller('servicesCtrl', 
		['$scope', '$http', '$log', '$ionicPopup', 'calcService', 'localStorageService',
		function ($scope, $http, $log, $ionicPopup, calcService, localStorageService) {
			
		$scope.light = {
			"name": "Light",
			"storage": "light_data", 
			"hist": "light_history", 
			"data": {
				"tariffs": [],
				"records": []
			}
		};
		$scope.gas = { 
			"name": "Gas",
			"storage": "gas_data",
			"hist": "gas_history", 
			"data": {
				"tariffs": [],
				"records": []
			}
		 };
		$scope.water = { 
			"name": "Water",
			"storage": "water_data",
			"hist": "water_history", 
			"data": {
				"tariffs": [],
				"records": []
			}
		};
		
		$scope.tariff = {};		
		$scope.temp = {};			
		$scope.CURRENCY = "uah";		
		
		$scope.getTariffs = function (service) {
			//fetches tariffs from local storage
			if (localStorageService.get(service.storage)) {
				service.data.tariffs = localStorageService.get(service.storage);
			} else {
				service.data.tariffs = []; 
			}	
		}
	   
		$scope.requiredCheck = function (checkform){			
			return checkform.$invalid && $scope.createTap;
		}
		
		$scope.createTariff = function (service, checkform) {
			
			$scope.createTap = true;
			
			if ($scope.tariff.rate != undefined && 
				$scope.tariff.price != undefined){
				service.data.tariffs.push($scope.tariff);
				localStorageService.set(service.storage, service.data.tariffs);
				$scope.tariff = {};
				$scope.createTap = false;
			}
		};

		$scope.removeTariff = function (service, index) {
			//removes a tariff
			var confirmDelete = $ionicPopup.confirm({
				title: 'Deleting..',
				template: 'Are you sure?',
				cancelText: 'No',
				okText: 'Yes'
			});
			confirmDelete.then(function(res) {
				if(res) {		
					service.data.tariffs.splice(index, 1);
					localStorageService.set(service.storage, service.data.tariffs);
				
				}
			});
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
			var confirmSave = $ionicPopup.confirm({
				title: 'Saving..',
				template: 'Are you sure?',
				cancelText: 'No',
				okText: 'Yes'
			});
			confirmSave.then(function(res) {
				if(res) {					
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
						$ionicPopup.alert({ 
							title: 'Changes saved!'
						});
					} else 
						$ionicPopup.alert({ 
							title: 'Mistake',
							template: 'Already paid this month!',
							buttons: [{ 
								text: 'History',
								type: 'button-positive',
								onTap: function(e) {
									$scope.selectTab('History');
								}
							  }
							]
						});
				}
			});
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