//******************************************************************************
//******************************  pagination  **********************************
//******************************************************************************
var paginationObject =   {
    total: null, pages: [], itemPerPage: 5, currentPage: 1, maxSize: 7,numPages:1,offset:1,endPage:1,

    set: function(total,itemPerPage,size){
        this.maxSize=size;
        this.itemPerPage=itemPerPage === undefined ? 5 : itemPerPage;
        this.total=total;
        this.numPages=Math.ceil(total/itemPerPage);
        this.setPages();
        return this;
    },
    setPages: function(){
        var begin_page = this.currentPage-this.maxSize/2;
        if(begin_page < 1)  begin_page = 1;
        var end_page = begin_page + this.maxSize - 1;
        if(end_page > this.numPages)
        {
            end_page = this.numPages;
            begin_page = end_page-this.maxSize+1;
            if(begin_page < 1)  begin_page = 1;
        }
        this.offset = begin_page;
        this.endPage = end_page;
        this.pages=[];
        for(i = begin_page;i <= end_page;i++) this.pages.push(i);
    },
    prevPage : function() {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
        }
        this.setPages();
    },
    nextPage : function() {
        if (this.currentPage < this.numPages ) {
            this.currentPage += 1;
        }
        this.setPages();
    },
    setPageId : function(id) {
        if (id >= 1 && id <= this.numPages) {
            this.currentPage = id;
        }
        this.setPages();
    }
} ;
//******************************************************************************
//*****************************  end pagination  *******************************
//******************************************************************************

var app = angular.module('myApp', []);
app.controller('customersCtrl', function($scope, $http) {

    //get data
    $http.get("php/KPI_data.php")
        .then(function (response) {
                $scope.AllKPIs = response.data.KPIs;
                $scope.KPIs = response.data.KPIs;
                $scope.pagination= paginationObject.set($scope.KPIs.length,2,4);
                $scope.Goals = response.data.Goals;
                $scope.filterApply = function() {  alert('aa'); };
                $scope.$watch('filteredKPIs', function() {
                    //alert($scope.filteredKPIs);
                    $scope.pagination= paginationObject.set($scope.filteredKPIs,2,4);
                    if($scope.pagination.currentPage > $scope.pagination.numPages) $scope.pagination.setPageId(1);
                });
                },
            function myError(response) { $scope.error = response.statusText; });

    //sort
    $scope.OrderByName = function(x) {//on:order_name
        $scope.order_reverse = (x !== null && $scope.on === x) ? !$scope.order_reverse : false;
        $scope.on = x;
    }

    //filter
    $scope.MakeFilter = function()
    {
        var x =  {title:!!$scope.ft?$scope.ft: undefined,
            reach:!!$scope.fr?$scope.fr: undefined,
            capture_rate:!!$scope.fcr?$scope.fcr: undefined,
            views:!!$scope.fv?$scope.fv: undefined,
            interaction_rate:!!$scope.fir?$scope.fir: undefined,
            interactions:!!$scope.fi?$scope.fi: undefined,
            goal:!!$scope.fg?$scope.fg: undefined};
        return x;
    }

});

app.filter('offset', function() {
    return function(input, start) {
        start = parseInt(start, 10);
        return input.slice(start);
    };
});



app.directive('helpBlock', helpBlockDirective);

function helpBlockDirective(){
    function helpBlockLink(scope, element, attrs) {
        scope.iconClass = attrs.helpBlockIconClass;
        //...
    }
}