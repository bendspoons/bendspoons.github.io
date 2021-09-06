var app = angular.module("contractScan", [

]);

var provider = null;

app.controller("mainCtrl", function($scope) {

  $scope.data = {
    'started'       : false,
    'bscscanAPIKey' : 'NHANXGTK4Z97VHSMSWC3A2SH3526RRC9W7',
    'tokenAddress'  : '',
    'abi'           : '',
    'info'          : {
      'name'    : '',
      'symbol'  : ''
    },
    'decimals'      : {
      'token' : 0,
      'bnb'   : 18
    },
    'functions'     : {
      'read': []
    }
  }

  $scope.loadTokenAddress = function() {
    $.getJSON('https://api.bscscan.com/api?module=contract&action=getabi&address=' + $scope.data.tokenAddress + '&apikey=' + $scope.data.bscscanAPIKey, function (data) {
      console.log('xxxxxxxxxxxxxxxdata', data)

      try {
        var c = JSON.parse(data.result)
      } catch(e) {
        $scope.$apply(function() {
          $scope.data.started = false;
          $scope.data.tokenAddress = '';
        })
        alert('Error: ' + data.result)
        return
      }
      $scope.data.abi = data.result

      //console.log('!!!contractABI', '$scope.data.abi', $scope.data.abi)
      //console.log('!!!contractABI', 'JSON.parse($scope.data.abi)', JSON.parse($scope.data.abi))

      if (typeof window.ethereum !== 'undefined') {
        provider = window.ethereum;
      } else if (typeof window.web3 !== 'undefined') {
        provider = window.web3.currentProvider;
      } else {
        provider = new Web3.providers.HttpProvider('https://bsc-dataseed1.binance.org:443');
      }

      if (provider) {
        console.log('Provider found!', provider);
        web3 = new Web3(provider);
        contract = new web3.eth.Contract(JSON.parse(data.result), $scope.data.tokenAddress);

        provider.on('error', function (e) {
          console.log('error', e);
        });
        provider.on('chainChanged', function (e) {
          console.log('chainChanged', e);
        });
        provider.on('accountsChanged', function (e) {
          console.log('accountsChanged', e);
        });
        provider.on('disconnect', function (e) {
          console.log('disconnected', e);
        });
        provider.on('connect', function (e) {
          console.log('connect', e);
        });

        if (provider.isConnected()) {
          console.log('provider.isConnected()');

          var abiParsed = JSON.parse($scope.data.abi);
          //console.log(abiParsed);
          angular.forEach(abiParsed, function (v, i) {
            //console.log('i', i, 'V', v);
            if(v.stateMutability == 'view' || v.stateMutability == 'pure') {

              v.readOnly = true;
            }

            $scope.$apply(function() {
              $scope.data.functions.read.push(v)
            })
          });

          /* defaults */
          contract.methods.name().call().then(function(result){
            console.log('!!!name', '=>', result)
            $scope.$apply(function() {
              $scope.data.info.name = result
            })
          }).catch(function (e) {
            console.log('!!!name', '=>', e)
          })

          contract.methods.decimals().call().then(function(result){
            console.log('!!!decimals', '=>', result)
            $scope.$apply(function() {
              $scope.data.decimals.token = result
            })
          }).catch(function (e) {
            console.log('!!!decimals', '=>', e)
          })

          contract.methods.symbol().call().then(function(result){
            console.log('!!!symbol', '=>', result)
            $scope.$apply(function() {
              $scope.data.info.symbol = result
            })
          }).catch(function (e) {
            console.log('!!!symbol', '=>', e)
          })

        } else {
          console.log('Provider not connected');
        }
      } else {
          console.log('No Provider found');
      }

    });
  }

  if($scope.data.tokenAddress.length > 0) {
    $scope.loadTokenAddress();
  }

  $scope.startNewSearch = function() {
    if($scope.data.tokenAddress.length > 0) {
      $scope.data.started = true;
      $scope.loadTokenAddress();
    }
  }

  $scope.executeFunction = function(func) {
    console.log('executeFunction', func);

    func.callError = false;

    if(func.inputs.length == 0) {
      var funcName = func.name;
      contract.methods[funcName]().call().then(function(result){
        console.log('!!!' + funcName, '=>', result, 'typeof', typeof result)

        $scope.$apply(function() {
          if(typeof result == 'object') {
            func.result = result
          } else {
            func.result = {
              'string': result
            };
          }

          if(funcName == 'decimals') {
            $scope.data.decimals.token = parseInt(result);
          }
        })

    	}).catch(function (e) {
        console.log('!!!' + funcName, '=>', e)

        $scope.$apply(function() {
          func.callError = e;
        })
      })

    } else {
      var proceed = 0;
      var needed = func.inputs.length;

      for(var i = 0;i<needed;i++) {
        if(func.inputs[i].hasOwnProperty('value')) {
          if(func.inputs[i].value.length > 0) {
            proceed++;
          }
        }
      }

      if(proceed == needed) {
        var jsonData = {}

        for(var i = 0;i<func.inputs.length;i++) {
          jsonData[func.inputs[i].internalType] = func.inputs[i].value
        }

        if(func.inputs.length == 1) {
          jsonData = func.inputs[0].value
        }

        var funcName = func.name;
        console.log('funcName', funcName)
        console.log('jsonData', jsonData)

        contract.methods[funcName](jsonData).call().then(function(result){
          console.log('!!!' + funcName, '=>', result, 'typeof', typeof result)

          $scope.$apply(function() {
            if(typeof result == 'object') {
              func.result = result
            } else {
              func.result = {
                'string': result
              };
            }

            if(funcName == 'decimals') {
              $scope.data.decimals.token = parseInt(result);
            }
          })

        }).catch(function (e) {
          console.log('!!!' + funcName, '=>', e)

          $scope.$apply(function() {
            func.callError = e;
          })
        })

      } else {
        alert('parameter notwendig')
      }
    }

  }

  $scope.convertFunction = function(which, func) {
    console.log('convertFunction', which, func);
    if(which == 'tokendecimals') {
      var supplyBase = parseInt(func.result.string);
      for(var i=1;i<=$scope.data.decimals.token;i++) {
        //console.log('b', supplyBase);
        supplyBase = (supplyBase/10);
        //console.log('a', supplyBase);
      }

      func.resultConverted = {
        'decimals': $scope.data.decimals.token,
        'result'  : supplyBase
      }
    }

    if(which == 'bnbdecimals') {
      var supplyBase = parseInt(func.result.string);
      for(var i=1;i<=$scope.data.decimals.bnb;i++) {
        //console.log('b', supplyBase);
        supplyBase = (supplyBase/10);
        //console.log('a', supplyBase);
      }

      func.resultConverted = {
        'decimals': $scope.data.decimals.bnb,
        'result'  : supplyBase
      }
    }

    if(which == 'address') {
      func.resultConverted = {
        'address': func.result.string
      }
    }

    if(which == 'date') {
      var timestamp = parseInt(func.result.string) * 1000 // s to ms
      //console.log('***timestamp', timestamp)
      var date = new Date(timestamp);
      //console.log(date.getTime())
      //console.log(date)

      var res = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())+
                "."+((date.getMonth()+1) < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1))+
                "."+date.getFullYear()+
                " "+(date.getHours() < 10 ? '0' + date.getHours() : date.getHours())+
                ":"+(date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())+
                ":"+(date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());

      func.resultConverted = {
        'date': res
      }
    }

    if(which == 'remaining') {
      var time = parseInt(func.result.string);
      var res = getTimeRemaining(time);
      func.resultConverted = {
        'timeleft': res
      }
    }
  }
});

function getTimeRemaining(append){
  var t = new Date();
  t.setSeconds(t.getSeconds() + append);

  var total = t - Date.parse(new Date());
  var seconds = Math.floor( (total/1000) % 60 );
      seconds = (seconds < 10 ? '0' + seconds : seconds);
  var minutes = Math.floor( (total/1000/60) % 60 );
      minutes = (minutes < 10 ? '0' + minutes : minutes);
  var hours = Math.floor( (total/(1000*60*60)) % 24 );
      hours = (hours < 10 ? '0' + hours : hours);
  var days = Math.floor( total/(1000*60*60*24) );
      days = (days < 10 ? '0' + days : days);

 return {
   total,
   days,
   hours,
   minutes,
   seconds
 };
}
