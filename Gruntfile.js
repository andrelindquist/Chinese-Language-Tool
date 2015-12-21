module.exports = function(grunt) {

	grunt.initConfig({
	    concat: {
	      distControllers: {
	        src: ['public/app/controllers/*.js'],
	        dest: 'public/build/js/controllers.js'
	      },
	      distServices: {
	      	src: ['public/app/services/*.js'],
	    	dest: 'public/build/js/services.js'
	      },
	      distDirectives: {
	    	src: ['public/app/directives/*.js'],
	    	dest: 'public/build/js/directives.js'
	      }
	    },
		watch: {
		  js: {
		    files: ['public/app/controllers/*.js', 'public/app/services/*.js', 'public/app/directives/*.js'],
		    tasks: ['concat'],
		  },
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');

};