/* 
 * The MIT License

 * Copyright 06-Mar-2015, 13:33:57
 *
 * Author    : Dulip Withanage , University of Heidelberg
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


myApp = angular.module('ui.bootstrap.demo', ['ui.bootstrap']);

myApp.service('myService', function ($rootScope) {
    var x = 5;
    var currentTab = {};
    return {
        increase: function (idx) {
            x = idx;
            $rootScope.$broadcast('XChanged', x);

            //console.log(x);
        },
        setTab : function (idx, value) {
            currentTab[idx]=value;
            $rootScope.$broadcast('currentTabChanged',currentTab);
        }
    };
});

myApp.controller("ControllerA", function ($scope, myService) {
    $scope.x = 1;

    $scope.incrementDataInService = function () {
        myService.increase();
    }
    $scope.$on('XChanged', function (event, x) {
        $scope.x = x;
    });

    $scope.$on('currentTabChanged', function (event, currentTab) {
        $scope.currentTab = currentTab;
    });

/**
    var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);
    c = paper.image("app/static/a.jpg", 0, 0, 500, 500);
    paper.rect(0, 0, 500, 500).attr({
        stroke: "red",
        fill: "0-#9bb7cb",
        opacity: 0
    });
    $scope.x = 1;
    $scope.currentTab = {};

    $scope.status = {'open': false};

    $scope.over = function () {
        this.c = this.c || this.attr("fill");
        this.stop().animate({fill: "#bacabd"}, 500);
        myService.increase(this.id);
        myService.setTab(this.id, true);

        $scope.$apply();


    };
    $scope.out = function () {
        this.stop().animate({fill: this.c}, 500);
        myService.increase();
        $scope.$apply();
        myService.setTab(this.id, false);

    };
    paper.setStart();
    for (var country in worldmap.shapes) {
        paper.path(worldmap.shapes[country]).attr({stroke: "#ccc6ae", fill: "blue", "stroke-opacity": 1, "fill-opacity": 0.2});
    }
    var world = paper.setFinish();
    world.hover($scope.over, $scope.out);
**/

});

myApp.controller("ControllerB", function ($scope, myService) {
    $scope.x = 1;
    $scope.incrementDataInService = function () {
        myService.increase();
    }
    $scope.$on('XChanged', function (event, x) {
        $scope.x = x;
    });
});


myApp.controller('AccordionDemoCtrl', function ($scope) {
    $scope.x = 1;
    $scope.incrementDataInService = function () {
        myService.increase();
    }
    $scope.$on('XChanged', function (event, x) {
        $scope.x = x;
    });

    $scope.$on('currentTabChanged', function (event, currentTab) {
        $scope.currentTab = currentTab;
    });
    $scope.currentTab = {};

    $scope.setTab = function (n, begin,end) {

        for (i= 0; i< end && i != n; i++){
            $scope.currentTab[i] = false;
        }


    }


    $scope.range = function (min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
    };
});
