//start angular module and inject characterService
angular.module('characterCtrl', ['characterService'])

//character controller for the main page
//inject character factory
.controller('characterController', function(Character, $sce) {

	var vm = this;

	//set a processing variable to show loading things
	vm.processing = true;

	//grab all the characters at page load
	Character.all()
	  .success(function(data) {

	  	//when all characters come back, remove the processing variable
	  	vm.processing = false;

	  	//bind the users that come back to vm.characters
	  	vm.characters = data;
	  });

	//function to delete a character
	vm.deleteCharacter = function(id) {
		vm.processing = true;

		Character.delete(id)
			.success(function(data) {

				// get all characters to update the table
				// you can also set up your api 
				// to return the list of users with the delete call
				Character.all()
					.success(function(data) {
						vm.processing = false;
						vm.characters = data;
					});

			});
	};

//Added 15/6/2015 - used on Flashcards page-

	vm.getData = function(key, value) {
		var count = 0;
		for (var i = 0; i < vm.characters.length; i += 1) {
			if (vm.characters[i][key] == value) {
				count += 1;
			}
		}
		vm.countResult = {calculated: true,
						  count: count,
						  key: key,
						  value: value,
						  message: "There are " + count + " characters in the database with a key of " + key + ", matching " + value + "."
						}
		console.log('Key: ' + key + '| Value: ' + value + ' ' + count);
		return vm.countResult;
	}

	vm.searchOn = false;
	vm.toggleSearch = function() {
		vm.searchOn = !vm.searchOn;
	}

	vm.getSrc = function() {
	  return $sce.trustAsResourceUrl("http://www.cantonese.sheik.co.uk/scripts/wordsearch.php");
	}
})

//controller applied to character creation page
.controller('characterCreateController', function(Character, $sce) {

	var vm = this;

	//variable to hide/show elements of the view
	//differentaites between create or edit pages
	vm.type = 'create';

	//function to create character
	vm.saveCharacter = function() {
		vm.processing = true;

		//clear the message
		vm.message = '';

		//use the create function in the characterService
		Character.create(vm.characterData)
		  .success(function(data) {
		  	vm.processing = false;

		  	//clear the form
		  	vm.characterData = {};
		  	vm.message = data.message;
		  });
	};

	vm.searchOn = false;
	vm.toggleSearch = function() {
		vm.searchOn = !vm.searchOn;
	}

	vm.getSrc = function() {
	  return $sce.trustAsResourceUrl("http://www.cantonese.sheik.co.uk/scripts/wordsearch.php");
	};
})


// controller applied to character edit page
.controller('characterEditController', function($routeParams, Character, $sce) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the user data for the user you want to edit
	// $routeParams is the way we grab data from the URL
	Character.get($routeParams.character_id)
		.success(function(data) {
			vm.characterData = data;
		});

	// function to save the character
	vm.saveCharacter = function() {
		vm.processing = true;
		vm.message = '';

		// call the characterService function to update 
		Character.update($routeParams.character_id, vm.characterData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.characterData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

		vm.searchOn = false;
	vm.toggleSearch = function() {
		vm.searchOn = !vm.searchOn;
	}

	vm.getSrc = function() {
	  return $sce.trustAsResourceUrl("http://www.cantonese.sheik.co.uk/scripts/wordsearch.php");
	}
});