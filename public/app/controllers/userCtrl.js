angular.module('userCtrl', ['userService'])

//controller for user creation page
.controller('userCreateController', function(User) {

	var vm = this;
	//variable to hide/show elements of the view
	//differentiates between create or edit pages
	vm.type = 'create';

	//function to create a user
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		//use the create function from userService
		User.create(vm.userData)
			.success(function(data) {
				vm.userData = {};
				vm.message = data.message;
			});
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