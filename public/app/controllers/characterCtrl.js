//start angular module and inject characterService
angular.module('characterCtrl', ['characterService', 'ngAnimate'])

//character controller for the main page
//inject character factory
.controller('characterController', function(Character, $scope) {

	var vm = this;

	//grab all the characters at page load
	Character.all()
	  .success(function(data) {

	  	//bind the users that come back to vm.characters
	  	vm.characters = data;
	  });

	//Event Listeners talk to charAddController - These respond when a user adds a new character
	$scope.$on('LOAD', function() {vm.loading = true});
	$scope.$on('UNLOAD', function() {
		vm.loading = false;

		//Update the model with all the characters- including the one that was just entered
		Character.all()
	  		.success(function(data) {
	  			vm.characters = data;
	  		});
	});

	//function to delete a character
	vm.deleteCharacter = function(id) {
		vm.processing = true;

		Character.delete(id)
			.success(function(data) {
				// get all characters to update the table
				Character.all()
					.success(function(data) {
						vm.processing = false;
						vm.characters = data;
					});
			});
	};

	vm.increment = function(definitionLength, index) {
		if (index < definitionLength - 1) {
			return index += 1;
		}
		else if (index >= definitionLength - 1) {
			return 0;
		}
	}

	vm.decrement = function(definitionLength, index) {
		if (index <= 0) {
			return definitionLength - 1;
		}
		else {
			return index -= 1;
		}
	}

//Added 15/6/2015 - used on Flashcards page- /////// 8/16/2015 Commented out- may add back in /// also need to add search function


	// vm.getData = function(key, value) {
	// 	var count = 0;
	// 	for (var i = 0; i < vm.characters.length; i += 1) {
	// 		if (vm.characters[i][key] == value) {
	// 			count += 1;
	// 		}
	// 	}
	// 	vm.countResult = {calculated: true,
	// 					  count: count,
	// 					  key: key,
	// 					  value: value,
	// 					  message: "There are " + count + " characters in the database with a key of " + key + ", matching " + value + "."
	// 					}
	// 	console.log('Key: ' + key + '| Value: ' + value + ' ' + count);
	// 	return vm.countResult;
	// }
})

//////////////////////////////////////////////////////////////
//controller for saving scraped character data
.controller('addCharController', function(Character, $scope) {

	var vm = this;
	vm.symbol = '';
	vm.addedCharacter;

	vm.addChar = function() {
		//only execute if vm.symbol is a single character
		if (vm.symbol.length === 1) {
			
			$scope.$emit('LOAD');  // characterController's 'loading' property will be set to true

			Character.addChar(vm.symbol)
				.success(function(data) {
					
					
					// console.log(vm.addedCharacter.character);
					vm.symbol = '';
					$scope.$emit('UNLOAD');
					vm.addedCharacter = data.character;
					console.log(vm.addedCharacter.character);
				});
		}
		else {
			console.log('You must enter one character');
		}
	}

	vm.closeAddedChar = function() {
		vm.addedCharacter = '';
	}
})
//////////////////////////////////////////////////////////////

//controller for manually entering character data
.controller('characterCreateController', function(Character, Auth) {

	var vm = this;

	//variable to hide/show elements of the view
	//differentaites between create or edit pages
	vm.type = 'create';

	//function to create character
	vm.saveCharacter = function() {

		Auth.getUser()
			.then(function(data) {
				vm.user = data.data;
				vm.username = vm.user.username;

		//use the create function in the characterService
				Character.create(vm.characterData, vm.username)
				  .success(function(data) {
				  	//clear the form
				  	vm.characterData = {};
				  	vm.message = data.message;
				  });
			})		
		//clear the message
		vm.message = '';
	};
})

.controller('characterEditController', function($routeParams, Character, Auth) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	//grab data from URL using $routeParams & get the character data to edit
	Character.get($routeParams.character_id)
		.success(function(data) {
			vm.characterData = data;
		});

	//Updates the Character with edited information
	vm.saveCharacter = function() {
		vm.message = '';

		Auth.getUser()
			.then(function(data) {
				vm.user = data.data;

				vm.username = vm.user.username;

				// call the characterService function to update 
				Character.update($routeParams.character_id, vm.characterData, vm.username)
					.success(function(data) {

						// clear the form
						vm.characterData = {};
						// bind the message from our API to vm.message
						vm.message = data.message;

					});
			});
	};
});