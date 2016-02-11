var hatr = angular.module('hatr',['hatr.controllers']);

hatr.service('getReviews',['$q',function($q){
    var get = function(){
        var response = $q.defer();
        service = new google.maps.places.PlacesService(window.map);
        navigator.geolocation.getCurrentPosition(
            function(position) {
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                service.nearbySearch( {location: pos ,keyword:'',radius:5500},callback);
                function callback(res,stat){
                        if(stat === "OK"){
                            return response.resolve(res);
                        }else{
                            return response.reject({text:stat});
                        }       
                }
            },function(error){
                response.reject("Something Went Wrong");
            }
    
        );
        return response.promise;
    };
    var pResults = [];
	var resultsDefer = $q.defer();
	var index = 0;

	 var getReview = function(){
		 var response = $q.defer();
		if(index < pResults.length){
        var placeID = pResults[index].place_id;
        
        var request = {
            placeId: placeID
        };
        

        service = new google.maps.places.PlacesService(window.map);
        service.getDetails(request, callback);
        function callback(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                index ++;
				response.resolve(place);
            }else{
                response.reject(status);
            }
        }
		}else{
			response.reject({text:"That's All The Haters For Now!"})
		}
        return response.promise;
    };
	
	function getAllReviews(){
        get().then(function(s){
            numResults = s.length;
			function shuffle(array) {
  				var currentIndex = array.length, temporaryValue, randomIndex ;
				// While there remain elements to shuffle...
  				while (0 !== currentIndex) {
    			// Pick a remaining element...
    			randomIndex = Math.floor(Math.random() * currentIndex);
    			currentIndex -= 1;
    			// And swap it with the current element.
    			temporaryValue = array[currentIndex];
    			array[currentIndex] = array[randomIndex];
    			array[randomIndex] = temporaryValue;
  			}

  			return array;
			}
			//SHUFFLE RANDOMLY
			s = shuffle(s);
			//SET ARRAY OF PLACES TO PULL FROM
            pResults = s;
			//GET REVIEW OF FIRST PLACE
			getReview().then(function(s){
				resultsDefer.resolve([s]);
			});
			
         },function(f){
			 resultsDefer.reject({text:"Your Device is not supported or you have not enabled location"})
		});
        
        return resultsDefer.promise;
    };
	
	
	
    return{
        get:getAllReviews,
		getNextReview: getReview 
    }
    
}]);

	
	