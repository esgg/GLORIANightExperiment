'use strict';

var numImages=0;
var focuserPosition=0;
var max_ccd_timer=5;
var num_ccd_timer=max_ccd_timer;

function TeleoperationExperimentCtrl(GloriaAPI, $scope, $timeout,
		$gloriaLocale, $routeParams) {

	$gloriaLocale.loadResource('telexp');

	$scope.requestRid = $routeParams.rid;
	$scope.reservationEnd = false;
	$scope.notAuthorized = false;
	$scope.serverDown = false;
	$scope.infoUpdated = false;
	$scope.wrongReservation = false;
	$scope.reservationActive = false;
	$scope.reservationObsolete = false;

	$scope.specificHtml = 'experiments/teleoperation/content.html';

	/*
	 * GloriaAPI.getActiveReservations(function(data) {
	 * data.forEach(function(element) { if ($scope.rid == undefined &&
	 * element.experiment == "SOLAR") {
	 * 
	 * if (element.status == "READY") { $scope.rid = element.reservationId;
	 * $scope.reservationActive = true; $scope.infoUpdated = true; } else if
	 * (element.status == "SCHEDULED") { $scope.preRid = element.reservationId;
	 * $scope.resTimer = $timeout($scope.onReservation, 1000); } } }); if
	 * ($scope.rid == undefined) { $scope.rid = -1; $scope.reservationActive =
	 * false; } }, function(error) { $scope.rid = -1; $scope.reservationActive =
	 * false; $scope.infoUpdated = true; }, function() { $scope.notAuthorized =
	 * true; });
	 */
	$scope.onReservation = function() {
		GloriaAPI.getReservationInformation($scope.preRid, function(data) {

			if (data.status == 'READY') {
				$scope.rid = $scope.preRid;
				$scope.reservationActive = true;
				$scope.infoUpdated = true;
			} else if (data.status == "SCHEDULED") {
				$scope.resTimer = $timeout($scope.onReservation, 1000);
			} else if (data.status == "OBSOLETE") {
				$scope.rid = -1;
				$scope.reservationObsolete = true;
				$scope.reservationActive = false;
				$scope.infoUpdated = true;
			}

		}, function(error) {
			$scope.rid = -1;
			$scope.reservationObsolete = false;
			$scope.reservationActive = false;
			$scope.infoUpdated = true;
		}, function() {
			$scope.notAuthorized = true;
		});
	};

	$scope.onUnauth = function() {
		$scope.$emit('unauthorized');
	};

	$scope.onDown = function() {
		$scope.$emit('server down');
	};

	$scope.onTimeout = function() {
		$scope.reservationActive = false;
	};

	$scope.onDeviceProblem = function() {
		$scope.deviceProblem = true;
		$scope.reservationActive = false;
	};

	$scope.$watch('reservationEnd', function() {
		if ($scope.reservationEnd) {
			$scope.endTimer = $timeout($scope.onTimeout, 1500);
		}
	});

	$scope.$watch('notAuthorized', function() {
		if ($scope.notAuthorized) {
			$scope.unauthTimer = $timeout($scope.onUnauth, 1500);
		}
	});

	$scope.$watch('serverDown', function() {
		if ($scope.serverDown) {
			$scope.srvTimer = $timeout($scope.onDown, 1500);
		}
	});

	$scope.$on('$destroy', function() {
		$timeout.cancel($scope.endTimer);
		$timeout.cancel($scope.unauthTimer);
		$timeout.cancel($scope.srvTimer);
		$timeout.cancel($scope.resTimer);
	});

	if ($routeParams.rid != undefined) {
		$scope.preRid = parseInt($scope.requestRid);

		if (!isNaN($scope.preRid)) {
			$scope.onReservation();
		} else {
			$scope.wrongReservation = true;
		}
	} else {
		$scope.reservationActive = true;
	}
}

function InitDevices(GloriaAPI, $scope){
	//GlAPI = GloriaAPI;
	
	$scope.ccd_order = 0;

	/*
		GloriaAPI.executeOperation($scope.requestRid,'get_filters', function(success){
			GloriaAPI.getParameterValue($scope.requestRid, 'fw', function(listFilters){
				$scope.filters_0 = listFilters.filters;
				//$scope.filter = listFilters.filters[0];
				GloriaAPI.setParameterTreeValue($scope.requestRid,'fw','selected',listFilters.filters[0],function(success){
					
				}, function(error){
					
				});
			}, function(error){
				//alert(error);
			});
				
		}, function(dataError, statusError){

		});
	*/
	
	GloriaAPI.executeOperation($scope.requestRid,'get_ccd_attributes', function(success){
			
	}, function(error){
		//alert(error);
	});
		
		
		/*
		GloriaAPI.getParameterTreeValue($scope.reservation,'focuser','position',function(success){
			console.log("Initial position:"+success);
		}, function(dataError,statusError){

		});
 */
}

function GetCamerasCtrl(GloriaAPI, $scope){
	//Cambiar a $scope.rid
		GloriaAPI.getParameterValue($scope.requestRid,'cameras',function(success){
			
			$("#scam0_name").text(success.scam.images[0].name);
			$("#scam0_img").attr("src",success.scam.images[0].url);
			
			$("#scam1_name").text(success.scam.images[1].name);
			$("#scam1_img").attr("src",success.scam.images[1].url);
				
			/*
				for (var nscam=0;nscam<success.scam.number;nscam++){
					
					var scamCode = "<div style=\"margin-top:"+80+"px;\">" +
							"<div style=\"width:100px;text-align:center;\"><span class=\"title\">"+success.scam.images[nscam].name+"</span></div>" +
							"<div class=\"expand\" style=\"z-index:"+(500-nscam)+";\">" +
							"<div class=\"positioner\">" +
							"<a class=\"slide\" aria-haspopup=\"true\">";
					scamCode = scamCode + "<img src=\""+success.scam.images[nscam].url+"\"/>";
					scamCode = scamCode + "</a></div></div></div>";
					
					$("#surveillance_panel").append(scamCode);	
				}
				*/
			}, function(error){
					alert(error);
					});

}
/* Devices controllers */
function MountDevice(GloriaAPI , $scope){
	
	console.log("Paso:"+$scope.target_name);
	$scope.hasMove= true;
	
	$scope.move_north = function(){
		if ($scope.hasMove){
			
		}
	};
	
	$scope.move_south = function(){
		if ($scope.hasMove){
			
		}
	};
	
	$scope.move_east = function(){
		if ($scope.hasMove){
			
		}
	};
	
	$scope.move_west = function(){
		if ($scope.hasMove){
			
		}
	};
	
	$scope.go = function(){

		var raRegularExpr = new RegExp(/^[-]?[0-9]+.[0-9]+$/);
		var decRegularExpr = new RegExp(/^[-]?[0-9]+.[0-9]+$/);
		var ra_value = $("#coords_ra").val();
		var dec_value = $("#coords_dec").val();
		
		if ($("#tags").val() == ""){	//Check if this field is empty
			if ((ra_value.match(raRegularExpr)) && (ra_value>=0) && (ra_value<360)){
					if ((dec_value.match(decRegularExpr) && (dec_value>=-90) && (dec_value<=90))){
						//Set radec
						SetRADEC(GloriaAPI, Sequence, $scope);
						//Execute go operation
						//GoRADEC(GloriaAPI, Sequence, $scope);
						
						
					} else {
						alert("Wrong dec value (MIN:-90, MAX:90)");
					}
			}  else {
				alert("Wrong ra value (MIN:0, MAX:360)");
			}	
		} else {
			//Set target name
			SetTargetName(GloriaAPI, Sequence, $scope);
			//Execute go operation
			//GoTargetName(GloriaAPI, Sequence, $scope)

		}
		
	};
	
	$scope.open_catalog = function(){
		$("#CatalogModal").modal();
	};
}
function CcdDevice(GloriaAPI, $scope, $timeout, $sequenceFactory){
	

	$scope.hasCcd = [false,false];
	$scope.hasFilterWheel = [false, false];
	$scope.hasFocuser = [false, false];
	
	$scope.hasCcd[0] = true;
	$scope.hasFilterWheel[0] = true;
	$scope.hasCcd[1] = true;
	
	$scope.ccd_alarm = false;
	
	$scope.ccd_sequence = $sequenceFactory.getSequence();
	
	//Load filters for CCD0.
	GloriaAPI.executeOperation($scope.requestRid,'get_filters', function(success){
		GloriaAPI.getParameterValue($scope.requestRid, 'fw', function(listFilters){
			$scope.filters_0 = listFilters.filters;
			//We select the first of the list as default value
			GloriaAPI.setParameterTreeValue($scope.requestRid,'fw','selected',listFilters.filters[0],function(success){
				
			}, function(error){
				
			});
		}, function(error){
			//alert(error);
		});
			
	}, function(dataError, statusError){

	});
	
	$scope.setFilter = function(){
		GloriaAPI.setParameterTreeValue($scope.requestRid,'fw','selected',$scope.filter,function(success){
			
		}, function(error){
			
		});
	};
	


	/*
	$scope.setOrder = function(order) {
		
		if (order == 0){
			$("#ccd_button_0").attr("class", "ccd_button_selected");
			$("#ccd_button_1").attr("class", "ccd_button");
			//$("#filter_selector").removeAttr("disabled");
		} else if (order == 1){
			$("#ccd_button_1").attr("class", "ccd_button_selected");
			$("#ccd_button_0").attr("class", "ccd_button");
			//$("#filter_selector").attr("disabled",true);
		}
		GloriaAPI.setParameterTreeValue($scope.requestRid,'cameras','ccd.order',parseInt(order),function(success){
			console.log("Paso:"+parseInt(order));
			$scope.ccd_order = parseInt(order);
			GloriaAPI.executeOperation($scope.requestRid,'get_ccd_attributes', function(success){
				
			}, function(error){
				//alert(error);
			});
		}, function(error){
			
		});
	};
	*/
	$scope.setOrder = function(order){
		console.log("Set order:"+order);
		
		$scope.ccd_order = parseInt(order);
	};
	
	$scope.expose = function(){
		console.log("Exponiendo");
	};
	/*
	$scope.expose = function(){

		console.log("Order:"+$scope.ccd_order);
		if (!$scope.isExposing){
			if (!isNaN($scope.exposure_time) && ($scope.exposure_time>0) && ($scope.exposure_time<=120)){			
				
				$scope.status_main_ccd = "telexp.ccd.status.exposing";
				$scope.isExposing = true;
				$scope.exposure_time[$scope.ccd_order] = $scope.exposure_time;
				num_ccd_timer=max_ccd_timer;
				
				console.log("set exposure time");
				SetExposureTime(GloriaAPI, $scope);

				console.log("set ccd attributes");
				SetCCDAttributes(GloriaAPI, $scope);
				
				console.log("start exposure");
				StartExposure(GloriaAPI, $scope, $timeout);
				
				
			} else {
				alert("Wrong parameter exposure time (MIN:0, MAX:120)");
			}
		} else {
			alert("Operation in progress");
		}
	};
	*/
}

function ImageCarousel(GloriaAPI, $scope){
	GloriaAPI.getImagesByContext($scope.requestRid,function(success){
		 $.each(success, function(i, image){ //Iterate among all images generate previously
				var htmlCode = "<a rel=\"prettyPhoto[caroufredsel]\" href=\""+image.jpg+"\" style=\"width:235px\">";
				htmlCode = htmlCode + "<img src=\""+image.jpg+"\"/></a>";
				$(htmlCode).appendTo("#foo2");
				numImages++;
				console.log(image.jpg);
	        });
		 
		 //If number of  images is greater than 4, apply carousel effect
		 if (numImages>4){
				$("#foo2").carouFredSel({
					circular: false,
					infinity: false,
					auto : false,
					responsive:true,
					items:4,
					width:"200",
					prev : "#foo1_prev",
					next : "#foo1_next"
				});			
			}
		 	//If the number of images is greater than 0, apply pretty effect
		 	if (numImages>0){
				$("#foo2 a").prettyPhoto({
					theme: "facebook",
					changepicturecallback: function() {
						$("#foo2").trigger("pause");
					},
					callback: function() {
						$("#foo2").trigger("play");
					}
				});			 		
		 	}
		
	}, function(error){
		
	});
}

/* Auxiliar functions */
function GetFilters(GloriaAPI, $scope, cid){
	GloriaAPI.getParameterValue(cid, 'fw', function(success){
		$scope.filters_0 = success.filters;
		$scope.filter = success.filters[0];
		GloriaAPI.setParameterTreeValue($scope.reservation,'fw','selected',$scope.filter,function(success){
			
		}, function(error){
			
		});
	}, function(error){
		//alert(error);
	});
	
}
function rotateAnnotationCropper(offsetSelector, xCoordinate, yCoordinate, cropper){
    //alert(offsetSelector.left);
    var x = xCoordinate - offsetSelector.offset().left - offsetSelector.width()/2;
    var y = -1*(yCoordinate - offsetSelector.offset().top - offsetSelector.height()/2);
    var theta = Math.atan2(y,x)*(180/Math.PI);        


    var cssDegs = convertThetaToCssDegs(theta);
        
    return cssDegs;   
}

function convertThetaToCssDegs(theta){
	var cssDegs = 90 - theta;
	return cssDegs;
}

function SetExposureTime(GloriaAPI, data){
	return data.ccd_sequence.execute(function() {
		return GloriaAPI.setParameterTreeValue(data.requestRid,'cameras','ccd.images.['+data.ccd_order+'].exposure',parseFloat(data.exposure_time),function(success){
				
			}, function(error){
				data.isExposing = false;
			});
	});
}
function SetCCDAttributes(GloriaAPI, data){
	return data.ccd_sequence.execute(function() {
		return GloriaAPI.executeOperation(data.requestRid,'set_ccd_attributes',function(success){
				
			}, function(error){
				//activateCcdAlarm("Fail to connect server");
				data.ccd_alarm = true;
				$("#ccd_alert").attr("title","Problem to set exposure time");
				data.ccd_alarm_message = "telexp.ccd.messages.internal_server";
				data.status_main_ccd = "telexp.ccd.status.error";
				data.isExposing = false;
			});
	});
}
function activateCcdAlarm(message){
	$("#ccd_budge").text("1");
	$("#ccd_budge").css("visibility","visible");
	$("#ccd_alert").attr("title",message);
	$("#expose_0_button").removeAttr("disabled");
}
function StartExposure(GloriaAPI, data, $timeout){
	console.log("ee"+data.ccd_order);
	return data.ccd_sequence.execute(function() {
		console.log("ee1"+data.ccd_order);
		return GloriaAPI.executeOperation(data.requestRid,'start_exposure',function(success){
			console.log("ee2"+data.ccd_order);
			GloriaAPI.getParameterTreeValue(data.requestRid,'cameras','ccd.images.['+data.ccd_order+'].inst.id',function(success){
				console.log("ee3"+data.ccd_order);
				if (success != -1){
					console.log("Image with id "+success+" generated");
					
					data.timer = $timeout(function() {exposureTimer(GloriaAPI, data, $timeout);}, parseInt(data.exposure_time*1000));
					
				} else {
					data.ccd_alarm = true;
					$("#ccd_alert").attr("title","No image id generated");
					data.ccd_alarm_message = "telexp.ccd.messages.internal_server";
					data.status_main_ccd = "telexp.ccd.status.error";
					data.isExposing = false;
				}
			}, function(error){
				data.isExposing = false;
				data.status_main_ccd = "telexp.ccd.status.error";
				data.ccd_alarm = true;
				$("#ccd_alert").attr("title","Problem to start exposure");
				data.ccd_alarm_message = "telexp.ccd.messages.internal_server";
				data.status_main_ccd = "telexp.ccd.status.error";
			});
				
				
			}, function(error){
				data.isExposing = false;
				data.status_main_ccd = "telexp.ccd.status.error";
				data.ccd_alarm = true;
				$("#ccd_alert").attr("title","Problem to start exposure");
				data.ccd_alarm_message = "telexp.ccd.messages.internal_server";
				data.status_main_ccd = "telexp.ccd.status.error";
			});
	});
}

/* Timers */

function exposureTimer(GloriaAPI, data, $timeout){

	console.log("Paso del timer");
	data.status_main_ccd = "telexp.ccd.status.transfering";
	GloriaAPI.executeOperation(data.requestRid,'load_image_urls',function(success){
		GloriaAPI.getParameterTreeValue(data.requestRid,'cameras','ccd.images.['+data.ccd_order+'].inst',function(success){
			if ((success.jpg!=null) && (success.fits)!=null){
		
				console.log("Deleting timer");
				//clearInterval(expTimer);
				var mImage = new Image();
				mImage.src = success.jpg;
				mImage.onload = function(e){
					var yFactor = mImage.height/550;
					var imageWidth = mImage.width/yFactor;
					var shift = (550-imageWidth)/2;
					$("#image_0").attr("src",success.jpg);
					$("#image_0").load(function (e){
						$("#main_image_container").css("margin-left",shift);
						$("#loading").css("visibility","hidden");
						$("#expose_0_button").removeAttr("disabled");
						
					});
				};
				data.status_main_ccd = "telexp.ccd.status.taken";
				//$("#ccd_status").removeClass("mess-info");
				data.isExposing = false;
				var htmlCode = "<a rel=\"prettyPhoto[caroufredsel]\" href=\""+mImage.src+"\" style=\"width:235px\">";
				htmlCode = htmlCode + "<img src=\""+mImage.src+"\"/></a>";
				$(htmlCode).appendTo("#foo2");
				numImages++;
				if (numImages>4){
					$("#foo2").carouFredSel({
						circular: false,
						infinity: false,
						auto : false,
						responsive:true,
						items:4,
						width:"variable",
						prev : "#foo1_prev",
						next : "#foo1_next"
					});			
				}
				$("#foo2 a").prettyPhoto({
					theme: "facebook",
					changepicturecallback: function() {
						$("#foo2").trigger("pause");
					},
					callback: function() {
						$("#foo2").trigger("play");
					}
				});
				/*$("#foo2 a").css("width",235);*/
			}else{
				console.log("Launching timer again");
				if (num_ccd_timer == 0){
					data.status_main_ccd = "telexp.ccd.status.error";
					data.isExposing = false;
				} else {
					num_ccd_timer--;
					data.timer = $timeout(function() {exposureTimer(GloriaAPI, data, $timeout);}, 1000);
				}

			}
		}, function(error){
			data.isExposing = false;
			data.status_main_ccd = "telexp.ccd.status.error";
		});
	}, function(error){
		data.isExposing = false;
		data.status_main_ccd = "telexp.ccd.status.error";
	});
						
}
function drawWeatherConditions(GloriaAPI, $scope, $timeout){
	console.log("Paso de estacion");
	GloriaAPI.executeOperation($scope.requestRid,'load_weather_values',function(success){
		GloriaAPI.getParameterValue($scope.requestRid,'weather',function(weather){
			$("#velocity").text(Math.round(weather.wind.value)+" m/s");
			$("#humidity").text(Math.round(weather.rh.value)+" % RH");
			$("#temperature").text(Math.round(weather.temperature.value)+" Deg.");
		}, function(error){

		});
	}, function(error){

	});
	$scope.weatherTimer = $timeout(function() {
		drawWeatherConditions(GloriaAPI, $scope, $timeout);
	}, 10000);
}
function WeatherDevice(GloriaAPI, $scope, $timeout){
	$scope.weatherTimer = $timeout(function() {
			drawWeatherConditions(GloriaAPI, $scope, $timeout);
		}, 10000);
	
}

