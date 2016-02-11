var hatrcontrollers = angular.module('hatr.controllers',[]);
hatrcontrollers.controller('reviews',['$scope','getReviews',function($scope,getReviews){
    $scope.insperationalBackgrounds = ['https://download.unsplash.com/photo-1417024321782-1375735f8987','https://download.unsplash.com/reserve/RONyPwknRQOO3ag4xf3R_Kinsey.jpg','https://download.unsplash.com/uploads/1411589183965bdf6e141/5f468e98','https://download.unsplash.com/photo-1416862291207-4ca732144d83','https://download.unsplash.com/photo-1414788020357-3690cfdab669','https://download.unsplash.com/reserve/nE6neNVdRPSIasnmePZe_IMG_1950.jpg','https://download.unsplash.com/reserve/OlxPGKgRUaX0E1hg3b3X_Dumbo.JPG','https://download.unsplash.com/uploads/1412825195419af52b492/8bc72ed7','https://download.unsplash.com/photo-1425136738262-212551713a58','https://download.unsplash.com/photo-1421809313281-48f03fa45e9f'];
	$scope.reviews = [];
	var index = 0;
	$scope.currentReview = {text:"Please Be Patient While We Retrieve Reviews Near You...",author_name:"Hatr"};
	getReviews.get().then(function(s){
       //GET ONLY ONE STAR REVIEWS 
		if($scope.reviews.length > 0){
        	$scope.reviews = filterReviews(s);
			var randomPic = Math.round(Math.random() * $scope.insperationalBackgrounds.length);
			$scope.currentPic = $scope.insperationalBackgrounds[randomPic];
        	$scope.currentReview = $scope.reviews[0];
		}else{
			$scope.nextReview();
		}
		
    },function(f){
		$scope.currentReview.text = f.text;
	});
	$scope.nextReview = function(){
		if(index < $scope.reviews.length){
		    var randomPic = Math.floor(Math.random() * $scope.insperationalBackgrounds.length);
		    $scope.currentPic = $scope.insperationalBackgrounds[randomPic];
			$scope.currentReview = $scope.reviews[index];
			index++;
		}else{
			//IF WE ARE AT THE END THEN GET MORE
        getReviews.getNextReview().then(function(s){
			s = filterReviews([s]);
			if(s.length > 0){
			//ONLY INC IF WE HAVE MORE THAN ONE REVIEW 		
			for(j=0;j<s.length;j++){
				$scope.reviews.push(s[j]);
			}
		    var randomPic = Math.floor(Math.random() * $scope.insperationalBackgrounds.length);
		    $scope.currentPic = $scope.insperationalBackgrounds[randomPic];
			$scope.currentReview = $scope.reviews[index];
			index ++;
			}else{
				$scope.nextReview();
			}
		},function(f){
			
			$scope.currentReview.text = "Looks Like thats all...";
			$scope.currentReview.author_name = "Hatr";
			$scope.currentReview.locationName = "";
		});
		}
	};
	function filterReviews(s){
		var lowRatingsArray = [];
        for(i=0;i<s.length;i++){
            if(s[i].hasOwnProperty('reviews') == true){
                for(j=0;j<s[i].reviews.length;j++){
                if(s[i].reviews[j].rating <= 2.1){
                    s[i].reviews[j].locationName = s[i].name;
                    lowRatingsArray.push(s[i].reviews[j]);
                }
                }
            }
        }
		return lowRatingsArray
	}
    
}]);