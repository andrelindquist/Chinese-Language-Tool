angular.module('mainCtrl', [])

.controller('mainController', function($rootScope, $scope, $location, Auth) {

	var vm = this;

	$scope.$watch(function(){
	    return Auth.isLoggedIn();
		}, function (authLogged) {
		    vm.loggedIn = authLogged;
		    Auth.getUser()
		    	.then(function(data) {
					vm.user = data.data;
				});
	});



	//check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();

		//get user information on page load
		Auth.getUser()
			.then(function(data) {
				vm.user = data.data;
			});
	});

	//function to handle login form
	vm.doLogin = function() {
		//clear the error
		vm.error = '';
		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				//if a user successfully logs in, redirect to home page
				if (data.success) {
					$location.path('/');
				} else {
					vm.error = data.message;
				}
			});

	};

	//function to handle logging out
	vm.doLogout = function() {
		Auth.logout();
		vm.user = '';

		$location.path('/');
	};
});