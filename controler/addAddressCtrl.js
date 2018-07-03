'use strict';
var app = angular.module('myApp', []);
app.controller('addressController', ['$scope', '$timeout', function($scope, $timeout) {
	mui.init({
		swipeBack: false //启用右滑关闭功能  
	})

	document.getElementById("selectCity").addEventListener('tap', function() {
		mui.openWindow({
			id: 'city',
			url: 'choice_city.html',
			extras: {
				fromId: 'add',
				index_home:'address'
			},
			show: {
				autoShow: true, //页面loaded事件发生后自动显示，默认为true
				aniShow: 'slide-in-right', //页面显示动画，默认为”slide-in-right“；
			},
		});
	})
	//选择城市列表
	document.addEventListener('curCity', function(event) {
//							var detail = JSON.parse(event.detail);//包含地址详细信息
		document.getElementById("curCity").innerText = event.detail.name;
	}, false)
}]);