"use strict";
angular.module('ShittyMoodApp', [])
.config(function($sceDelegateProvider) {
 $sceDelegateProvider.resourceUrlWhitelist([
   // Allow same origin resource loads.
   'self',
   // Allow loading from our assets domain.  Notice the difference between * and **.
   'https://i.imgur.com/**',
   'https://www.youtube.com/**'
  ]);
 })
.service('ShittyService', function($http) {
      this.get = get;

      function get(payload){
        return $http({
          method: 'GET',
          params: payload,
          url: 'https://api.reddit.com/r/Eyebleach+palatecleanser+awwducational+Panda_Gifs+stoptouchingme+GirlsCuddlingPuppies+animalssmiling+CozyPlaces+reallifedoodles'
        })
      }
})
.controller('ShittyController', function($scope, ShittyService) {
       $scope.greeting = "Hello World";
       $scope.index = 0;
       $scope.next = next;
       $scope.prev = prev;
       $scope.getType = getType;
       $scope.type = null;


       ShittyService.get({limit: 100}).then(function(response){
         $scope.list = response.data.data.children;
         prepareJson();
       });

       function next(){
         $scope.index = $scope.index === $scope.list.length ? 0 : ++$scope.index;
         if(!$scope.list[$scope.index].data.type){
           next();
         }
       }

       function prev(){
         $scope.index = !$scope.index ? $scope.index : --$scope.index;
         if(!$scope.list[$scope.index].data.type){
           prev();
         }
       }

       function prepareJson(){
         var tmp = $scope.list;
         angular.forEach(tmp, function(item, key){
           var type = getType(item.data);
           if(type){
             item.data.type = type;
           } else {
             $scope.list.splice(key, 1);
           }
           item.data.url = item.data.url.replace('http:', "https:");
           item.data.url = item.data.url.replace('gifv', "mp4");
         })
       }

       function getType(item){
         if(item.domain === "youtube.com"){
           item.url = item.url.replace("watch?v=", "embed/");
           return "youtube";
         } else if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(item.url)){
           return "img";
         } else if(item.domain === "i.imgur.com"){
           return "gifv";
         } else {
           return false;
         }
       }
});
