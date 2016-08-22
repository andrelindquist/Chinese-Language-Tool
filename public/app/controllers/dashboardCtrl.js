angular.module('dashboardCtrl', ['userService'])

.controller('dashboardController', function(User, Auth) {

	var vm = this;
	vm.sortCriteria = 'proficiency';
	vm.ascending = true;

	Auth.getUser()
		.then(function(data) {
			vm.user = data.data;

			vm.username = vm.user.username;
			
			User.get(vm.username)
		    	.success(function(data) {

			  	//bind the users that come back to vm.characters
			  	vm.user = data;
			  	
			  });
		});

	vm.toggleAscending = function() {
		vm.ascending = !vm.ascending;
	}

	vm.sort = function(sortCriteria, ascending) {
		console.log(vm.sortCriteria + "  " + ascending);
		vm.user.vocabList = vm.user.vocabList.sort(function(a, b) {
			if (ascending) {
				return a[sortCriteria] - b[sortCriteria];	
			}
			else {
				return b[sortCriteria] - a[sortCriteria];
			}
		});
	}
})