(function(){

    /* fuel types */
    var fuelTypes = [
        {
            id: 1,
            name: 'briquets',
            burningDuration: 1*60*60 //1 hour
        },
        {
            id: 1,
            name: 'firewood',
            burningDuration: 40*60 //40 minutes
        },
        {
            id: 2,
            name: 'test',
            burningDuration: 30 //30 seconds
        }
    ];
    
    /* fire keepers list */
    var fireKeepers = [
        {
            id: 1,
            name: 'Galyna'
        },
        {
            id: 2,
            name: 'Ostap'
        },
        {
            id: 3,
            name: 'Tatyana'
        }
    ];

    /* ctrl */
    MainController.$inject = ['$interval', '$scope', 'fuelTypes', 'fireKeepers'];
    function MainController($interval, $scope, fuelTypes, fireKeepers){
        this.loadPeriod = 40;
        this.refreshInterval = 1000;
        this.$interval = $interval;
        this.selectedKeeper = fireKeepers[1];
        this.fireKeepers = fireKeepers;
        this.selectedFuel = fuelTypes[2];
        this.fuelTypes = fuelTypes;
        this.inProggress = false;
    }


    MainController.prototype.start = function () {
        var loadPeriodMs = this.loadPeriod * 60 * 1000;
        this.loadsMade = 0;
        this.nextLoad = {
            timeLeft: loadPeriodMs,
            loadPeriod: loadPeriodMs
        };
        this.nextLoad.percentsLeft = this.getPercents();
        this.isStarted = true;
        this.interval = this.$interval(this.updateTimer.bind(this), this.refreshInterval);
    };

    MainController.prototype.updateTimer = function(){
        if(this.nextLoad.timeLeft <= 0){
            this.loadsMade++;
            this.notifyFireKeeper();
            this.nextLoad.loadPeriod = this.loadPeriod * 60 * 1000;
            this.nextLoad.timeLeft = this.nextLoad.loadPeriod;
            this.nextLoad.percentsLeft = this.getPercents();
        } else {
            this.nextLoad.timeLeft -= this.refreshInterval;
            this.nextLoad.percentsLeft = this.getPercents();
        }
    };

    MainController.prototype.makeLoad = function(){
        var loadPeriodMs = this.loadPeriod * 60 * 1000;
        this.$interval.cancel(this.interval);
        this.loadsMade++;
        this.nextLoad.loadPeriod = loadPeriodMs;
        this.nextLoad.timeLeft = this.nextLoad.loadPeriod;
        this.nextLoad.percentsLeft = this.getPercents();
        this.interval = this.$interval(this.updateTimer.bind(this), this.refreshInterval);
    };

    MainController.prototype.getPercents = function () {
        return Math.ceil( (this.nextLoad.timeLeft * 100) / (this.nextLoad.loadPeriod) );
    };

    MainController.prototype.notifyFireKeeper = function () {
        
    };
    
    MainController.prototype.stop = function(){
        var message = "Brave Fire Keeper, you've made " + this.loadsMade + " loads! Neighbours are celebrating!";
        this.$interval.cancel(this.interval);
        this.isStarted = false;
        this.loadsMade = 0;
        alert(message);
    };

    MainController.prototype.reportLoad = function(){
        this.session.loadsCount++;
        this.nextLoad.date = new Date((new Date()).getTime() + this.selectedFuel.burningDuration*1000);
    };

    /* declarations */
    angular.module('boiler-duty', ['ngMaterial'])
        .constant('fuelTypes', fuelTypes)
        .constant('fireKeepers', fireKeepers)
        .controller('main', MainController)
        .filter('time', function () {
            return function (input) {
                function z(n) {
                    return (n < 10 ? '0' : '') + n;
                }
                var inputInSec = input / 1000;
                var seconds = inputInSec % 60;
                var minutes = Math.floor(inputInSec % 3600 / 60);
                var hours = Math.floor(inputInSec / 3600);
                return (z(hours) + ':' + z(minutes) + ':' + z(seconds));
            }
        });
    
})();
