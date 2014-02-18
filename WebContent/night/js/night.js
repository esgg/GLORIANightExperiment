
var numImages=0;
var focuserPosition=0;
var max_ccd_timer=5;
var num_ccd_timer=max_ccd_timer;

function InitDevices($gloriaAPI, $sequenceFactory, $scope){
	
	
	$scope.ccd_order = 0;
	
	//Variables to manage the focuser
	$scope.initFocuserPosition = 0;
	$scope.finalFocuserPosition = 1000;  //This could be set by experiment model
	$scope.currentFocuserPosition = 0;

		
	//Init sequence
	//Load ccd attributes automatilly
	$scope.init_sequence = $sequenceFactory.getSequence();
	
	/*
	$scope.$watch('rid', function(){
		if ($scope.rid > 0){
			$gloriaAPI.executeOperation($scope.requestRid,'get_ccd_attributes', function(success){
				
			}, function(error){
				//alert(error);
			});
		}
	});
	*/
	
	//Change the order of the ccd
	$scope.setOrder = function(order){
		console.log("Changing ccd order");
		$scope.ccd_order = parseInt(order);
		$gloriaAPI.setParameterTreeValue($scope.rid,'cameras','ccd.order',parseInt(order),function(success){
			
		}, function(error){
			
		});
	};
		
}


function FocuserCtrl($gloriaAPI, $scope){
	
	//Read the initial position of the focuser
	$gloriaAPI.getParameterTreeValue($scope.requestRid,'focuser','position',function(success){
		console.log("Initial position:"+success);
		if (success != ""){
			$( "#focuserPosition" ).text(success);
			$("#focuser_slider").slider("value",success );
			$scope.currentFocuserPosition = success;
			
			var angle = (success*18)/100;
		     var rotate = 'rotate(' +angle + 'deg)';
		     $('#focus_marker').css({'-moz-transform': rotate, 'transform' : rotate, '-webkit-transform': rotate, '-ms-transform': rotate});
		}
	}, function(dataError,statusError){
		alert(statusError);
	});
	
	$scope.activate_focuser = function(){
		$scope.focuserPressed = true;

	};
	
	//Set the focuser new value
	$scope.set_focuser = function(){
		$scope.focuserPressed = false;
		var newPositionInt = parseInt($( "#focuserPosition" ).text()); 
		var currentPositionInt = parseInt($scope.currentFocuserPosition);
		var numSteps = newPositionInt - currentPositionInt;

		$gloriaAPI.setParameterTreeValue($scope.requestRid,'focuser','position',$( "#focuserPosition" ).text(),function(success){
			
		}, function(error){
			//TODO Error message
		});
		
		$gloriaAPI.setParameterTreeValue($scope.requestRid,'focuser','steps',numSteps,function(success){
			console.log("Move "+numSteps+" steps");
			$gloriaAPI.executeOperation($scope.requestRid,'move_focus', function(success){
				console.log("Focuser moved");
				$scope.currentFocuserPosition = $( "#focuserPosition" ).text();
			}, function(error){
				//alert(error);
			});
			
		}, function(error){
			//TODO Error message
		});
		
	};
	
	//Cancel the new position of the focuser
	$scope.cancel = function(){
		$scope.focuserPressed = false;
		//Update to original value  in popup and slide
		 $( "#focuserPosition" ).text($scope.currentFocuserPosition);
		 $("#focuser_slider").slider("value",$scope.currentFocuserPosition );
		 
		 //Go to original position
		 rotateOriginalDegree = ($scope.currentFocuserPosition*18)/100;
	     var rotate = 'rotate(' +rotateOriginalDegree + 'deg)';
	     $('#focus_marker').css({'-moz-transform': rotate, 'transform' : rotate, '-webkit-transform': rotate, '-ms-transform': rotate});
	};
}

//Draw surveillance cameras
function GetCamerasCtrl($gloriaAPI, $scope){
	//Change to a $scope.rid
		$gloriaAPI.getParameterValue($scope.requestRid,'cameras',function(success){
			
			$("#scam0_name").text(success.scam.images[0].name);
			$("#scam0_img").attr("src",success.scam.images[0].url);
			
			$("#scam1_name").text(success.scam.images[1].name);
			$("#scam1_img").attr("src",success.scam.images[1].url);
				
			}, function(error){
					alert(error);
					});

}
/* Devices controllers */
function MountDevice($gloriaAPI , $scope, $sequenceFactory){
	
	$scope.mount_sequence = $sequenceFactory.getSequence();
	
	$scope.$watch('rid', function(){
		
		if ($scope.rid > 0){
			$gloriaAPI.executeOperation($scope.rid,'load_mount_status',function(success){
				$gloriaAPI.getParameterTreeValue($scope.rid,'mount','status',function(success){
					console.log("Status:"+success);
					if (success == "PARKED"){
						$scope.status_mount = "night.mount.status.parked"
					} else if (success == "TRACKING"){
						$scope.status_mount = "night.mount.status.tracking"
					} else if (success == "STOP"){
						$scope.status_mount = "night.mount.status.stop"
					}
					
				}, function(error){
					$scope.mount_alarm = true;
					$scope.mount_alarm_message = "night.mount.messages.alarm_status";
					$scope.mount_status = "night.mount.status.error";
				});
			}, function(error){
				$scope.mount_alarm = true;
				$scope.mount_alarm_message = "night.mount.messages.alarm_status";
				$scope.mount_status = "night.mount.status.error";
			});
		}
	});
	
	$scope.move_north = function(){
		if ($scope.hasMove){
			$gloriaAPI.executeOperation($scope.requestRid,'move_north',function(success){
				
			}, function(dataError, statusError){

			});
		}
	};
	
	$scope.move_south = function(){
		if ($scope.hasMove){
			$gloriaAPI.executeOperation($scope.requestRid,'move_south',function(success){
				
			}, function(dataError, statusError){

			});
		}
	};
	
	$scope.move_east = function(){
		if ($scope.hasMove){
			$gloriaAPI.executeOperation($scope.requestRid,'move_east',function(success){
				
			}, function(dataError, statusError){

			});
		}
	};
	
	$scope.move_west = function(){
		if ($scope.hasMove){
			$gloriaAPI.executeOperation($scope.requestRid,'move_west',function(success){
				
			}, function(dataError, statusError){

			});
		}
	};
	
	/*
	$scope.go = function(){
		if ((($scope.rah>=0) && ($scope.rah<=24)) && (($scope.ram>=0) && ($scope.ram<=60)) && (($scope.ras>=0) && ($scope.ras<=60))){
			if ((($scope.decg>=-90) && ($scope.decg<=90)) && (($scope.decm>=0) && ($scope.decm<=60)) && (($scope.decs>=0) && ($scope.decs<=60))){
				alert(convertRaToDecimal($scope.rah, $scope.ram, $scope.ras)+" "+convertDecToDecimal($scope.decg, $scope.decm,$scope.decs));
			} else {
				alert("Wrong dev value: [-90-+90]:[0-60]:[0-60]");
			}
		} else {
			alert("Wrong ra value: [0-24]:[0-60]:[0-60]");
		}
		
	};
	*/
	
	$scope.go = function(){

				console.log("RA"+$scope.rah);
		if ($("#tags").val() == ""){	//Check if this field is empty
			if ((($scope.rah>=0) && ($scope.rah<=24)) && (($scope.ram>=0) && ($scope.ram<=60)) && (($scope.ras>=0) && ($scope.ras<=60))){
				if ((($scope.decg>=-90) && ($scope.decg<=90)) && (($scope.decm>=0) && ($scope.decm<=60)) && (($scope.decs>=0) && ($scope.decs<=60))){
						//Set radec
						SetRADEC($gloriaAPI, $scope);
						//Execute go operation
//						GoRADEC($gloriaAPI,  $scope);
						
						
					} else {
						alert("Wrong dev value: [-90-+90]:[0-60]:[0-60]");
					}
			}  else {
				alert("Wrong ra value: [0-24]:[0-60]:[0-60]");
			}	
		} else {
			//Set target name
			SetTargetName($gloriaAPI, $scope);
			//Execute go operation
//			GoTargetName($gloriaAPI, $scope);

		}
		
	};
	
	$scope.open_catalog = function(){
		console.log("Dec:"+$scope.dec);
		if (($scope.dec!=undefined) && ($scope.dec.length>0)){
			console.log("longitud:"+$scope.dec.length);
		}
		$("#CatalogModal").modal();
	};
	
	$scope.hasCoordinates = function(){
		var hasRaCoordinate = (($scope.rah != undefined) && ($scope.rah.length > 0)) || (($scope.ram != undefined) && ($scope.ram.length > 0)) || (($scope.ras != undefined) && ($scope.ras.length > 0)); 
		var hasDecCoordinate = (($scope.decg != undefined) && ($scope.decg.length > 0)) || (($scope.decm != undefined) && ($scope.decm.length > 0)) || (($scope.decs != undefined) && ($scope.decs.length > 0)); 
		return (hasRaCoordinate || hasDecCoordinate);
		//		return (($scope.ra != undefined) && ($scope.dec != undefined) && (($scope.ra.length > 0) || ($scope.dec.length >0)));
	};
	
	$scope.hasTargetName = function(){
		return (($scope.target_name != undefined ) && ($scope.target_name.length > 0));
	};
	
	$scope.setTargetName = function(){
//		$scope.target_name = name;
		$scope.target_name = $scope.target_selected;
		$scope.rah = undefined;
		$scope.ram = undefined;
		$scope.ras = undefined;
		$scope.decg = undefined;
		$scope.decm = undefined;
		$scope.decs = undefined;
	}
	$scope.selectTarget = function(name){
		$scope.target_selected = name;
	}
	
}

function convertRaToDecimal(hour, minutes, seconds){
	var raDecimal = 0.0;
	raDecimal = raDecimal + hour * 15;
	raDecimal = raDecimal + minutes * 0.25;
	raDecimal = raDecimal + seconds * (15 / 3600);
	return raDecimal.toFixed(3);
}
function convertDecToDecimal(grades, arcminutes, arcseconds){
	var decDecimal=parseFloat(grades);
	if (grades<0){
		decDecimal = decDecimal - (arcminutes / 60);
		decDecimal = decDecimal - (arcseconds / 3600);
	} else {
		decDecimal = decDecimal + (arcminutes / 60);
		decDecimal = decDecimal + (arcseconds / 3600);		
	}
	return decDecimal.toFixed(3);
}

function SetRADEC($gloriaAPI, data){
	
	var coordinates = new Object();
	coordinates.ra = convertRaToDecimal(data.rah, data.ram, data.ras);
	coordinates.dec = convertDecToDecimal(data.decg, data.decm,data.decs);
	
	return data.mount_sequence.execute(function() {
		return $gloriaAPI.setParameterTreeValue(data.requestRid,'mount','target.coordinates',coordinates,function(success){
			
		}, function(error){
			data.mount_alarm = true;
			data.mount_alarm_message = "night.mount.messages.alarm_set_radec";
			data.status_main_ccd = "night.ccd.status.error";
		});
	});
	
}

function GoRADEC($gloriaAPI, data){
	
		
	return data.mount_sequence.execute(function() {
		return $gloriaAPI.executeOperation(data.requestRid,'point_to_coordinates',function(success){
			
		}, function(error){
			data.mount_alarm = true;
			data.mount_alarm_message = "night.mount.messages.alarm_taget";
			data.status_main_ccd = "night.ccd.status.error";
		});
	});
	
}

function SetTargetName($gloriaAPI, data){
		
	return data.mount_sequence.execute(function() {
		return $gloriaAPI.setParameterTreeValue(data.requestRid,'mount','target.object',data.target_name,function(success){
			
		}, function(error){
			data.mount_alarm = true;
			data.mount_alarm_message = "alarm_set_target";
			data.status_main_ccd = "night.ccd.status.error";
		});
	});
	
}

function GoTargetName($gloriaAPI, data){
	
	return data.mount_sequence.execute(function() {
		return $gloriaAPI.executeOperation(data.requestRid,'point_to_object',function(success){
			
		}, function(error){
			data.mount_alarm = true;
			data.mount_alarm_message = "night.mount.messages.alarm_taget";
			data.status_main_ccd = "night.ccd.status.error";
		});
	});
	
}

function CcdDevice($gloriaAPI, $scope, $timeout, $sequenceFactory){
	

	$scope.hasCcd = [false,false];
	$scope.hasFilterWheel = [false, false];
	$scope.hasFocuser = [false, false];
	$scope.hasVideoMode = [false,false];
	
	//$scope.hasCcd[0] = true;
	$scope.hasFilterWheel[0] = true;
	//$scope.hasCcd[1] = true;
	//$scope.hasVideoMode [0] = true;
	
	$scope.ccd_alarm = false;
	
	$scope.ccd_sequence = $sequenceFactory.getSequence();
	
	/*
	$gloriaAPI.executeOperation($scope.requestRid,'get_filters', function(success){
		$gloriaAPI.getParameterValue($scope.requestRid, 'fw', function(listFilters){
			$scope.filters_0 = listFilters.filters;
			//We select the first of the list as default value
			$gloriaAPI.setParameterTreeValue($scope.requestRid,'fw','selected',listFilters.filters[0],function(success){
				$scope.filter = $scope.filters_0[0];
			}, function(error){
				
			});
		}, function(error){
			//alert(error);
		});
			
	}, function(dataError, statusError){

	});
	*/

	$scope.$watch('rid', function(){
		
		if ($scope.rid > 0){
			console.log("Run init sequence");
			
			
			GetNumCcds($gloriaAPI,$scope);
			LoadCcdAttributes($gloriaAPI,$scope);
			LoadContinuousMode($gloriaAPI,$scope)
			
			
//			$scope.$watch('$scope-num_ccds', function(){
//				console.log("Entrada");
//				LoadCcdAttributes($gloriaAPI,$scope);
//				SetCcdOrder($gloriaAPI,$scope,1);
//				LoadCcdAttributes($gloriaAPI,$scope);
//				SetCcdOrder($gloriaAPI,$scope,0);
//			});
			
			
			
			//Load filters for CCD0.
			$gloriaAPI.executeOperation($scope.requestRid,'get_filters', function(success){
				$gloriaAPI.getParameterValue($scope.requestRid, 'fw', function(listFilters){
					$scope.filters_0 = listFilters.filters;
					//We select the first of the list as default value
					$gloriaAPI.setParameterTreeValue($scope.requestRid,'fw','selected',listFilters.filters[0],function(success){
						$scope.filter = $scope.filters_0[0];
					}, function(error){
						
					});
				}, function(error){
					//alert(error);
				});
					
			}, function(dataError, statusError){

			});
			console.log("Finish init sequence");
			
		}
	});
	
	
	
	$scope.setFilter = function(){
		$gloriaAPI.setParameterTreeValue($scope.requestRid,'fw','selected',$scope.filter,function(success){
			
		}, function(error){
			
		});
	};
	


	/*
	$scope.expose = function(){
		//$scope.ccd_alarm = true;
		$scope.isExposing = true;
		//$scope.ccd_alarm_message = "telexp.ccd.messages.internal_server";
		console.log("Exposition...");
		
	};
	*/
	$scope.video = function(){
		console.log("Video mode ....");
		$scope.isVideo = true;
	};
	
	$scope.expose = function(){

		console.log("Order:"+$scope.ccd_order);
		$scope.isVideo = false;
		if (!$scope.isExposing){
			if (!isNaN($scope.exposure_time) && ($scope.exposure_time>0) && ($scope.exposure_time<=120)){			
				$scope.ccd_sequence = $sequenceFactory.getSequence();
				$scope.status_main_ccd = "night.ccd.status.exposing";
				$scope.isExposing = true;
				$scope.exposure_time[$scope.ccd_order] = $scope.exposure_time;
				num_ccd_timer=max_ccd_timer;
				
				console.log("set exposure time:"+$scope.exposure_time[$scope.ccd_order]+" "+num_ccd_timer);
				SetExposureTime($gloriaAPI, $scope);

				console.log("set ccd attributes");
				SetCCDAttributes($gloriaAPI, $scope);
				
				console.log("start exposure");
				StartExposure($gloriaAPI, $scope, $timeout);
				
				console.log("load inst images")
				CheckInstImages($gloriaAPI, $scope, $timeout);
				
				
			} else {
				alert("Wrong parameter exposure time (MIN:0, MAX:120)");
			}
		} else {
			alert("Operation in progress");
		}
	};
	
}

function GetNumCcds($gloriaAPI, data){
	console.log("get_ccd");
	return data.ccd_sequence.execute(function() {
		return $gloriaAPI.getParameterValue(data.rid, 'cameras', function(success){
			console.log("Number of ccds:"+success.ccd.number);
			data.num_ccds = success.ccd.number;
			if (success.ccd.number>=1){
				data.hasCcd[0] = true;
			} 
			if (success.ccd.number>=2){
				data.hasCcd[1] = true;
			}
			
		}, function(error){
			//alert(error);
		});
	});
}
function LoadContinuousMode($gloriaAPI, data){
	console.log("load_continuous_mode");
	return data.ccd_sequence.execute(function() {
		return $gloriaAPI.executeOperation(data.rid,'load_continuous_image', function(success){
			console.log("get continuous mode");
			hasVideoMode[data.ccd_order] = true;
		}, function(error){
			//alert(error);
		});
	});
}

function LoadCcdAttributes($gloriaAPI, data){
	console.log("load_ccd");
	return data.ccd_sequence.execute(function() {
		return $gloriaAPI.executeOperation(data.rid,'get_ccd_attributes', function(success){
			console.log("get ccd attributes");
		}, function(error){
			//alert(error);
		});
	});
}

function SetCcdOrder($gloriaAPI, data, order){
	console.log("set ccd order")
	return data.ccd_sequence.execute(function() {
		return $gloriaAPI.setParameterTreeValue(data.rid,'cameras','ccd.order',order,function(success){
			console.log("ccd order");
		}, function(error){
			
		});
	});
}

function ImageCarousel($gloriaAPI, $scope){
	$gloriaAPI.getImagesByContext($scope.requestRid,function(success){
		 $.each(success, function(i, image){ //Iterate among all images generate previously
				var htmlCode = "<a rel=\"prettyPhoto[caroufredsel]\" href=\""+image.jpg+"\" target=\"_self\" style=\"width:235px\">";
				htmlCode = htmlCode + "<img src=\""+image.jpg+"\"/></a>";
				$(htmlCode).appendTo("#foo2");
				numImages++;
				console.log(image.jpg);
	        });
		 
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
		 	
		
	}, function(error){
		
	});
}

/* Auxiliar functions */
function GetFilters($gloriaAPI, $scope, cid){
	$gloriaAPI.getParameterValue(cid, 'fw', function(success){
		$scope.filters_0 = success.filters;
		$scope.filter = success.filters[0];
		$gloriaAPI.setParameterTreeValue($scope.reservation,'fw','selected',$scope.filter,function(success){
			
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

function SetExposureTime($gloriaAPI, data){
	return data.ccd_sequence.execute(function() {
		return $gloriaAPI.setParameterTreeValue(data.requestRid,'cameras','ccd.images.['+data.ccd_order+'].exposure',parseFloat(data.exposure_time),function(success){
				
			}, function(error){
				data.isExposing = false;
			});
	});
}
function SetCCDAttributes($gloriaAPI, data){
	return data.ccd_sequence.execute(function() {
		return $gloriaAPI.executeOperation(data.requestRid,'set_ccd_attributes',function(success){
				
			}, function(error){
				//activateCcdAlarm("Fail to connect server");
				data.ccd_alarm = true;
				data.ccd_alarm_message = "night.ccd.messages.internal_server";
				data.status_main_ccd = "night.ccd.status.error";
				data.isExposing = false;
			});
	});
}
function activateCcdAlarm(message){
	$("#ccd_budge").text("1");
	$("#ccd_budge").css("visibility","visible");
	$("#expose_0_button").removeAttr("disabled");
}
function StartExposure($gloriaAPI, data, $timeout){
	console.log("eee0"+data.ccd_order);
	return data.ccd_sequence.execute(function() {
		console.log("ee1"+data.ccd_order);
		return $gloriaAPI.executeOperation(data.requestRid,'start_exposure',function(success){
			console.log("ee2"+data.ccd_order);
			data.$parent.imageTaken = false;
			}, function(error){
				data.isExposing = false;
				data.status_main_ccd = "night.ccd.status.error";
				data.ccd_alarm = true;
				data.ccd_alarm_message = "night.ccd.messages.alarm_start_exposure";
			});
	});
}

function CheckInstImages($gloriaAPI, data, $timeout){
	console.log("ee4"+data.ccd_order);
	return data.ccd_sequence.execute(function(){
		console.log("ee5"+data.ccd_order);
		return $gloriaAPI.getParameterTreeValue(data.requestRid,'cameras','ccd.images.['+data.ccd_order+'].inst.id',function(success){
			console.log("ee3"+data.ccd_order);
			if (success != -1){
				console.log("Image with id "+success+" generated");
				
				data.timer = $timeout(function() {exposureTimer($gloriaAPI, data, $timeout);}, parseInt(data.exposure_time*1000));
				
			} else {
				data.ccd_alarm = true;
				data.ccd_alarm_message = "night.ccd.messages.internal_server";
				data.status_main_ccd = "night.ccd.status.error";
				data.isExposing = false;
			}
		}, function(error){
			data.isExposing = false;
			data.status_main_ccd = "night.ccd.status.error";
			data.ccd_alarm = true;
			data.ccd_alarm_message = "night.ccd.messages.internal_server";
		});
	});
}

/* Timers */

function exposureTimer($gloriaAPI, data, $timeout){

	console.log("Paso del timer");
	data.status_main_ccd = "night.ccd.status.transfering";
	$gloriaAPI.executeOperation(data.requestRid,'load_image_urls',function(success){
		$gloriaAPI.getParameterTreeValue(data.requestRid,'cameras','ccd.images.['+data.ccd_order+'].inst',function(success){
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
				data.status_main_ccd = "night.ccd.status.taken";
				//$("#ccd_status").removeClass("mess-info");
				data.isExposing = false;
				data.$parent.imageTaken = true;
				/*
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
				*/
				/*$("#foo2 a").css("width",235);*/
			}else{
				console.log("Launching timer again");
				if (num_ccd_timer == 0){
					data.status_main_ccd = "night.ccd.status.error";
					data.isExposing = false;
				} else {
					num_ccd_timer--;
					data.timer = $timeout(function() {exposureTimer($gloriaAPI, data, $timeout);}, 1000);
				}

			}
		}, function(error){
			data.isExposing = false;
			data.status_main_ccd = "night.ccd.status.error";
		});
	}, function(error){
		data.isExposing = false;
		data.status_main_ccd = "night.ccd.status.error";
	});
						
}
function drawWeatherConditions($gloriaAPI, $scope, $timeout){
	console.log("Paso de estacion");
	$gloriaAPI.executeOperation($scope.rid,'load_weather_values',function(success){
		$gloriaAPI.getParameterValue($scope.requestRid,'weather',function(weather){
			$("#velocity").text(Math.round(weather.wind.value)+" m/s");
			$("#humidity").text(Math.round(weather.rh.value)+" % RH");
			$("#temperature").text(Math.round(weather.temperature.value)+" Deg.");
			/*
			 * Activate when the alarm will be included in the system
			if (!$scope.weather_alarm){
				console.log("No hay alarma");
				$("#WeatherAlarmModal").modal();
				$scope.weather_alarm = true;	
			}
			*/
		}, function(error){

		});
	}, function(error){
		if (error.status = 500){
			$timeout.cancel($scope.weatherTimer);
		}
	});
	$scope.weatherTimer = $timeout(function() {
		drawWeatherConditions($gloriaAPI, $scope, $timeout);
	}, 10000);
	$scope.$on('$destroy', function() {
		$timeout.cancel($scope.weatherTimer);
	});
}
function WeatherDevice($gloriaAPI, $scope, $timeout){
	$scope.$watch('rid', function(){
		if ($scope.rid > 0){
			$scope.weatherTimer = $timeout(function() {
				drawWeatherConditions($gloriaAPI, $scope, $timeout);
			}, 10000);
		}
	});
}

/* Solar Album  */

function LoadMyImages($gloriaAPI, scope) {
	scope.images = [];

	return $gloriaAPI.getImagesByContext(scope.rid, function(data) {
		var i = 0;

		data.forEach(function(element) {
			scope.images.push({
				order : i,
				jpg : element.jpg,
				fits : element.fits,
				date : element.creationDate,
				target : element.target
			});
			i++;
		});
	});

}

function SolarImagesCtrl($gloriaAPI, $sequenceFactory, $scope, $timeout, $modal, $log) {

	$scope.sequence = $sequenceFactory.getSequence();
	$scope.images = [];
	$scope.currentIndex = 0;
	$scope.thumbsReady = true;	

	$scope.items = [ 'item1', 'item2', 'item3' ];

	$scope.sliderStyle = {
		left : "0px"
	};

	$scope.$watch('rid', function() {
		if ($scope.rid > 0) {
			LoadMyImages($gloriaAPI, $scope);
			$scope.sliderStyle.left = "0px";
		}
	});
	
	$scope.latencyTimeout = function() {
		$scope.thumbsReady = true;
	};

	$scope.$watch('imageTaken', function() {
		if ($scope.rid > 0 && $scope.$parent.imageTaken) {			
			LoadMyImages($gloriaAPI, $scope).then(function() {
				$scope.thumbsReady = false;	
				$scope.currentIndex = Math.max(0, $scope.images.length - 6);
				$scope.latencyTimer = $timeout($scope.latencyTimeout, 1000);
			});
		}
	});

	$scope.nextRight = function() {
		if ($scope.currentIndex + 6 < $scope.images.length) {
			$scope.currentIndex++;
		}
	};

	$scope.nextLeft = function() {
		if ($scope.currentIndex > 0) {
			$scope.currentIndex--;
		}
	};

	$scope.filterFn = function(element) {
		return element.order >= $scope.currentIndex
				&& element.order < $scope.currentIndex + 6;
	};

	$scope.$on('$destroy', function() {
		$timeout.cancel($scope.latencyTimer);
	});

	$scope.open = function(image) {

		var modalInstance = $modal.open({
			templateUrl : 'myModalContent.html',
			controller : ModalInstanceCtrl,
			resolve : {
				image : function() {
					return image;
				}
			},
			windowClass : "image-modal"
		});

		modalInstance.result.then(function(selectedItem) {
			$scope.selected = selectedItem;
		}, function() {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

}

var ModalInstanceCtrl = function($scope, $modalInstance, $location, image) {

	$scope.image = image;
	/*
	 * $scope.selected = { item : $scope.items[0] };
	 */

	$scope.ok = function() {
		$modalInstance.close($scope.url);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

	$scope.downloadJpg = function() {

	};
};

function TimeReservationCtrl($gloriaAPI, $scope,$timeout){
	
	$scope.$watch('rid', function() {
		if ($scope.rid > 0) {
			
			$gloriaAPI.getRemainingTime($scope.rid, function(data) {
				var remainingTime = Math.max(0, parseInt(data))
				var remainingMinutes = parseInt(remainingTime / 60);
				var remainingSeconds = remainingTime % 60;
				
				//$("#timer_minutes").text(remainingMinutes);
				//$("#timer_seconds").text(remainingSeconds);
				
				setInterval(function(){
					remainingTime = Math.max(0,remainingTime - 1);
					remainingMinutes = Math.max(0,parseInt(remainingTime / 60));
					remainingSeconds = Math.max(0,remainingTime % 60);
					
					if (remainingMinutes < 10){
						$("#timer_minutes").text("0"+remainingMinutes);
					} else {
						$("#timer_minutes").text(remainingMinutes);	
					}
					if (remainingSeconds < 10){
						$("#timer_seconds").text("0"+remainingSeconds);
					} else {
						$("#timer_seconds").text(remainingSeconds);	
					}
					
				},1000);
				$scope.remainingTimer = $timeout ($scope.onTimeOut, (remainingTime-120)*1000);
			});
		}
	});
	$scope.onTimeOut = function(){
		$gloriaAPI.getRemainingTime($scope.rid, function(data) {
			if (!$scope.last_minutes){
				$("#ReservationTimeModal").modal();	
			}
			console.log("Queda un minuto");
			$scope.last_minutes = true;
			$scope.remainingTimer = $timeout ($scope.onTimeOut, 5000);
		}, function(response){
			console.log("Fin de la reserva en response:"+response.status);
			$scope.$parent.$parent.$parent.reservationEnd = true;
			if (response.status == 406) {
				console.log("Fin de la reserva");
			}
		});
	};
}
