angular.module('mainCtrl', [])

.controller('mainController', function($rootScope, $location, Auth) {

	var vm = this;

	//get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();

	//check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();

		//get user information on page load
		Auth.getUser()
			.then(function(data) {
				vm.user = data.data;
				console.log(vm.user);
			});
	});

	//function to handle login form
	vm.doLogin = function() {
		//clear the error
		vm.error = '';

		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				//if a user successfully logs in, reidrect to users page
				if (data.success) {
					$location.path('/dashboard');
				} else {
					vm.error = data.message;
				}
			});

	};

	//function to handle logging out
	vm.doLogout = function() {
		Auth.logout();
		vm.user = '';

		$location.path('/login');
	};
});