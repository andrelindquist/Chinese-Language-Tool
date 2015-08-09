angular.module('dashboardCtrl', ['userService'])

.controller('dashboardController', function(User, Auth) {

	var vm = this;

	Auth.getUser()
		.then(function(data) {
			vm.user = data.data;

			vm.username = vm.user.username;
			
			User.get(vm.username)
		    	.success(function(data) {

			  	//bind the users that come back to vm.characters
			  	vm.user = data;
			  	console.log(data);
			  });
		});
})