var app = angular.module('yalg',['ionic']);

app.config(function($stateProvider, $urlRouterProvider, $compileProvider) {
    $stateProvider.
        state('main', {
            url         : '/',
            templateUrl : 'templates/main.html',
            controller  : 'MainCtrl'
        }).
        state('levels', {
            url         : '/levels',
            templateUrl : 'templates/levels.html',
            controller  : 'LevelsCtrl'
        }).
        state('level', {
            url         : '/level/:levelId',
            templateUrl : 'templates/level.html',
            controller  : 'LevelCtrl'
        }).
        state('logo', {
            url         : '/level/:levelId/logo/:logoId',
            templateUrl : 'templates/logo.html',
            controller  : 'LogoCtrl'
        }).
		state('logo-found', {
			url 		: '/level/:levelId/logo-found/:logoId',
			templateUrl : 'templates/logo-found.html',
			controller  : 'LogoCtrl'
		}).
        state('about', {
            url         : '/about',
            templateUrl : 'templates/about.html',
            controller  : 'MainCtrl'
        });

    $urlRouterProvider.otherwise('/');

    /**
     * Firefox OS only
     * @see https://developer.mozilla.org/en-US/Apps/Build/App_development_FAQ#Why_am_I_getting_an_.22address_wasn't_understood.22_error_with_AngularJS.3F
     */
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|app):/);
});

app.controller('MainCtrl', ['$scope',
    function($scope) {
        $scope.appname = "YALG";
        $scope.descr = "Yet Another Logo Game";
}]);

app.controller('LevelsCtrl', ['$scope','$http',
    function($scope,$http) {

        //getting list of levels
        $http.get('data/levels.json').success(function(data) {
            $scope.levels = data;
        });
}]);


app.controller('LevelCtrl', ['$scope', '$stateParams', '$http',
    function($scope,$stateParams,$http){
        $scope.levelId = $stateParams.levelId;

        //getting list of levels
        $http.get('data/levels.json').success(function(data) {
            $scope.levels = data;
            for (var i=0;i<$scope.levels.length;i++) {
                if($scope.levels[i].id == $scope.levelId) {
                    $scope.lvl = $scope.levels[i];
                    break;
                }
            }

            var logoList = angular.element(document.querySelector('#logo-list'));
            var cnt = ""; //content of logoList
            for (var i=0;i<$scope.lvl.content.logos.length;i++) {
                var currLogo = $scope.lvl.content.logos[i];
				
				if (localStorage[currLogo.name]) {
					cnt += '<li>'+
						'<a href="#/level/'+$scope.levelId+'/logo/'+currLogo.id+'">' +
						'<img src="'+currLogo.img+'" class="logo-img">'+
						'<i class="ion-checkmark"></i>' +
						'</a>'+
						'</li>';
				} else {
				
					cnt += '<li>'+
						'<a href="#/level/'+$scope.levelId+'/logo/'+currLogo.id+'">' +
						'<img src="'+currLogo.img+'" class="logo-img">'+
						'</a>'+
						'</li>';
				}
			}
				
				logoList.html(cnt);

        });
}]);

app.controller('LogoCtrl', ['$scope','$stateParams','$http', '$location',
    function($scope,$stateParams,$http, $location){
        $scope.levelId = $stateParams.levelId;
        $scope.logoId = $stateParams.logoId;

        //getting list of levels
        $http.get('data/levels.json').success(function(data) {
            $scope.levels = data;
            for (var i=0;i<$scope.levels.length;i++) {

                //level found
                if($scope.levels[i].id == $scope.levelId) {
                    $scope.lvl = $scope.levels[i];
                    break;
                }
            }

            for (var i=0;i<$scope.lvl.content.logos.length;i++) {

                if($scope.lvl.content.logos[i].id == $scope.logoId) {
                    $scope.logo = $scope.lvl.content.logos[i];
                    break;
                }
            }

			
			//this logo is found before
			if (localStorage[$scope.logo.name]) {
				$location.path('/level/'+ $scope.lvl.id +'/logo-found/'+$scope.logo.id);
			}
			
            var img = angular.element(document.querySelector('#logo-img'));
            img.attr('src',$scope.logo.img);
			
        });
		
		//check if the logo name is found
        $scope.check = function(name) {
            if (angular.isDefined(name) && name.toUpperCase() == $scope.logo.name.toUpperCase()) {
				localStorage[$scope.logo.name] = true;
                console.log(localStorage[$scope.logo.name]);
				alert("Correct!");
                history.back(-1);
            }
        }
}]);