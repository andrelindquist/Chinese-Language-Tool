angular.module('userCtrl', ['userService', 'authService', 'ngAnimate'])

//controller for user creation page
.controller('userCreateController', function(User, Auth) {

	var vm = this;
	//variable to hide/show elements of the view
	//differentiates between create or edit pages
	vm.type = 'create';

	//function to create a user
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		if (vm.userData.username && vm.userData.password.length > 5) {
			//use the create function from userService
			User.create(vm.userData)
				.success(function(data) {

					//login using 'authService'
					Auth.login(vm.userData.username, vm.userData.password);

					vm.userData = {};
					vm.message = data.message;
				});
		}
		else {
			vm.message = "Your password must be at least six characters long";
		}

		vm.processing = false;
	};
})

//controller for user edit page
.controller('userEditController', function($routeParams, User) {

	var vm = this;

	vm.type = 'edit';

	//get the user data for user to edit
	// use $routeParams tp grab data from URL
	User.get($routeParams.user_id)
		.success(function(data) {
			vm.userData = data;
		});

	//function to save the user
	vm.saveUser = function() {
		vm.message = '';

		//call the userService function to update
		User.update($routeParams.user_id, vm.userData)
			.success(function(data) {
				//clear the form
				vm.userData = {};

				//bind message from API to vm.message
				vm.message = data.message;
			});
	};
});