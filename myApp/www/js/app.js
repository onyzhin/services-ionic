'use strict';

(function () {
	// Ionic Starter App

	var app = angular.module('servicesapp', ['ionic', 'servicesapp.controllers', 'LocalStorageModule']);

	app.run(function($ionicPlatform) {
		
	  $ionicPlatform.ready(function() {

		if (window.cordova && window.cordova.plugins.Keyboard) {
		  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		  cordova.plugins.Keyboard.disableScroll(true);

		}
		if (window.StatusBar) {
		  // org.apache.cordova.statusbar required
		  StatusBar.styleDefault();
		}
	  });
	  
	})

	app.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {

		localStorageServiceProvider
			.setPrefix('scotch-todo');

		$stateProvider
			.state('app', {
				url: '/app',
				abstract: true,
				templateUrl: 'templates/menu.html'
			})
			.state('app.light', {
				url: '/light',
				views: {
					'menuContent': {
						templateUrl: 'templates/light.html',
						controller: 'servicesCtrl'
					}
				}
			})
			.state('app.gas', {
				url: '/gas',
				views: {
					'menuContent': {
						templateUrl: 'templates/gas.html',
						controller: 'servicesCtrl'
					}
				}
			})
			.state('app.water', {
				url: '/water',
				views: {
					'menuContent': {
						templateUrl: 'templates/water.html',
						controller: 'servicesCtrl'
					}
				}
			})
		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/app/light');
	});

	app.directive('toggleClass', function() {
		return {
		  restrict: 'A',
		  link: function(scope, element, attrs) {
			  element.on('focusin', function() {
				element.addClass(attrs.toggleClass)
			  });
			  element.on('focusout', function() {
				element.removeClass(attrs.toggleClass)
			  });
		  }
		};
	});

	app.filter('searchFor', function(){
		// All filters must return a function. The first parameter
		// is the data that is to be filtered, and the second is an
		// argument that may be passed with a colon (searchFor:searchString)

		return function(arr, searchString){

			if(!searchString){
				return arr;
			}
			var result = [];
			searchString = searchString;
			// Using the forEach helper method to loop through the array
			angular.forEach(arr, function(item){
				console.log(item.date);
				if(String(item.date).indexOf(searchString) !== -1){
					result.push(item);
				}
			});
			return result;
		};
	})

	app.service('calcService', function(){	

		this.greaterZero = function(value) {
		  return value >= 0; 
		}
		
		this.isNumber = function(value) {
		  return typeof value == 'number';
		}		

		this.subtract = function(a, b) {
			return b-a;
		}
		
		this.check = function(checkFunc, checkValue) {		
			for (var j = 0; j < checkFunc.length; j++) {
				for (var i = 0; i < checkValue.length; i++) {
				  if (!checkFunc[j](checkValue[i])) {
					return false
				  }
				}
			}
			return true;
		}  
		
		this.calculate = function (data, x){	
			var result = 0;
			for (var j = 0; j < data.length; j++) {
				var rate = data[j].rate;
				var price = data[j].price;
				if (x > rate && rate != 0) {
					result += rate * price;
					x = x - rate;
				} else {
					result += x * price;
					return result.toFixed(2);
				}
			}
			return result.toFixed(2);
		}
		
		this.formatDate = function(date)  {
			return [
				date.getDate(),
				date.getMonth() + 1,
				date.getFullYear() % 100
			].map(function(val){
				return val < 10 ? '0' + val : val;
			}).join('.');
		}
		
	});

}) (); 