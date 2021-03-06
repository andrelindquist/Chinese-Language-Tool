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
	      // ,
	      // scssSheets: {
	      // 	src: ['public/assets/scss/*.scss'],
	      // 	dest: 'public/build/scss/scssCombined.scss'
	      // }
	    },
		sass: {
			dist: {
			  files: {
			  	// 'public/build/css/stylesCombined.css': 'public/build/scss/scssCombined.scss'
			  	'public/build/css/main.css': 'public/assets/scss/main.scss'
			  	//, 'blah.css': 'blah.scss'
			  }
			}
		},
		watch: {
		  js: {
		    files: ['public/app/controllers/*.js', 'public/app/services/*.js', 'public/app/directives/*.js', 'public/assets/scss/**/*.scss'],
		    tasks: ['concat', 'sass'],
		  },
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');

};