(function(){
  'use strict';

  angular.module('NarrowItDownApp',[])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItems);


  function FoundItems(){
    var ddo = {
      templateUrl: 'menuItems.html',
      scope: {
        found: '<',
        onRemove: '&'
      },
      controller: FoundItemsDirectiveController,
      controllerAs: 'ctrl',
      bindToController: true
    };

    return ddo;
  }

  function FoundItemsDirectiveController(){
    var list = this;

    // list.isListEmpty= function(){
    //
    //   console.log("list lenght", list.found.length);
    //   return list.found.length==0;
    // }

  }


  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService){
    var ctrl = this;

    ctrl.found = [];
    ctrl.searchTerm;
    ctrl.isListEmpty =false;

    ctrl.removeItem = function (itemIndex) {
      ctrl.found.splice(itemIndex,1);
    };
    ctrl.filter = function(searchTerm){
      ctrl.found = [];
        ctrl.isListEmpty =false;

      if(searchTerm){
        var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
        promise.then(
          function(response){
            ctrl.found = response;
            if(ctrl.found.length==0){
              ctrl.isListEmpty=true;
            }
          },
          function(response){
            console.log("err:", response);
            ctrl.isListEmpty=true;
          }
        )

      }else{
        ctrl.isListEmpty=true;
      }

    }
  };


  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http){
    var  service = this;
    service.getMatchedMenuItems = function (searchTerm) {
      var response = $http({
        method: "GET",
        url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
      }).then(
        function(response){
          var foundItems =[];
          var menuItems = response.data.menu_items;

          console.log("searchTerm", searchTerm);
          for(var i=0;i<menuItems.length; i++){

            if(menuItems[i].description.includes(searchTerm)){
              foundItems.push(menuItems[i]);
            }
          }
          console.log("filted:", foundItems.length);
          return foundItems;

        },
        function(response){
          console.log("err:", response);
          return response;
        });
        return response;
      };
    }
  })();
