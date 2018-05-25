'use strict';
var app = angular.module('app', []);
app.controller('cityController', ['$scope', '$timeout', '$http', function($scope, $timeout, $http) {
	mui.init();
	$scope.cancelText = "取消";
	$scope.searchStatus = false;
	mui.plusReady(function() {
		var cwv = plus.webview.currentWebview();
		var cwvP = plus.webview.getWebviewById('city');
		var fromId = cwvP.fromId;
		var index_home = cwvP.index_home;
		var webview_index = plus.webview.getWebviewById(fromId);
		var index_home = plus.webview.getWebviewById(index_home);
		var searchIpt = document.querySelector('.searchIpt');
		var searchScroll = document.querySelector('.mui-scroll-wrapper');
		var cityWrapper = document.querySelector('.city-wrapper-hook');
		var cityScroller = document.querySelector('.scroller-hook');
		var cities = document.querySelector('.cities-hook');
		var shortcut = document.querySelector('.shortcut-hook');

		var scroll;

		var shortcutList = [];
		var anchorMap = {};

		function initCities() {
			var y = 0;
			var titleHeight = 28;
			var itemHeight = 44;

			var lists = '';
			var en = '<ul>';
			cityData.forEach(function(group) {
				var name = group.name;
				lists += '<div class="title">' + name + '</div>';
				lists += '<ul>';
				group.cities.forEach(function(g) {
					lists += '<li class="item" data-name="' + g.name + '" data-id="' + g.cityid + '"><span class="border-1px name">' + g.name + '</span></li>';
				});
				lists += '</ul>';

				var name = group.name.substr(0, 1);
				en += '<li data-anchor="' + name + '" class="item">' + name + '</li>';
				var len = group.cities.length;
				anchorMap[name] = y;
				y -= titleHeight + len * itemHeight;

			});
			en += '</ul>';

			cities.innerHTML = lists;

			shortcut.innerHTML = en;
			shortcut.style.top = (cityWrapper.clientHeight - shortcut.clientHeight) / 2 + 'px';
			mui('.cities-hook').on('tap', 'li', function(e) {
				var detail = this.getAttribute('data-name');
				var code = this.getAttribute('data-id');

				mui.fire(webview_index, 'changeLoc', {
					name: detail,
					code: code
				});
				mui.fire(index_home, 'getWeather', {
					name: detail,
					code: code
				});
				mui.back();
				cwvP.close();
			})
			//					cities.querySelector('li').addEventListener('tap', function(e) {
			//						if(!event._constructed) { //如果不存在这个属性,则不执行下面的函数
			//							return;
			//						}
			//						alert(22)
			//					})
			scroll = new window.BScroll(cityWrapper, {
				probeType: 3,
				click: true
			});

			// scroll.on('scroll', function (pos) {
			//   console.log(Math.round(pos.y));
			// });

			scroll.scrollTo(0, 0);
		}

		//bind Event
		function bindEvent() {
			var touch = {};
			var firstTouch;

			shortcut.addEventListener('touchstart', function(e) {

				var anchor = e.target.getAttribute('data-anchor');

				firstTouch = e.touches[0];
				touch.y1 = firstTouch.pageY;
				touch.anchor = anchor;

				scrollTo(anchor);

			});

			shortcut.addEventListener('touchmove', function(e) {

				firstTouch = e.touches[0];
				touch.y2 = firstTouch.pageY;

				var anchorHeight = 16;

				var delta = (touch.y2 - touch.y1) / anchorHeight | 0;

				var anchor = shortcutList[shortcutList.indexOf(touch.anchor) + delta];

				scrollTo(anchor);

				e.preventDefault();
				e.stopPropagation();

			});

			function scrollTo(anchor) {
				var maxScrollY = cityWrapper.clientHeight - cityScroller.clientHeight;

				var y = Math.min(0, Math.max(maxScrollY, anchorMap[anchor]));

				if(typeof y !== 'undefined') {
					scroll.scrollTo(0, y);
				}
			}
		}

		initCities();

		bindEvent();

		$scope.selectCity = function(item) {
			var detail = item.name;
			var code = item.cityid;

			mui.fire(webview_index, 'changeLoc', {
				name: detail,
				code: code
			});
			mui.fire(index_home, 'getWeather', {
					name: detail,
					code: code
				});
			mui.back();
			cwv.close();
		}

		mui('.mui-scroll-wrapper').scroll({
			deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
		var mask = mui.createMask(function() {
			searchScroll.style.display = 'none';
		});
		//				var cwv = plus.webview.currentWebview();
		searchIpt.addEventListener('input', function(e) {
			var _value = this.value;
			if(_value == null || _value.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '') == "") return;
			_value = _value.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '').toUpperCase();
			$timeout(function() {
				$scope.searchResult = [];
				cityData.forEach(function(item) {
					item.cities.forEach(function(n) {
						if(n.name.indexOf(_value) == 0 || n.tags.indexOf(_value) == 0) {
							$scope.searchResult.push(n);
						}
					})
				})
			}, 350)
		})
		searchIpt.addEventListener('keyup', function(e) {
			var _value = this.value;
			if(_value == null || _value.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '') == "") {
				$timeout(function() {
					$scope.searchResult = [];
					return;
				})
			};
		})
		mui('.mui-search').on('tap', '.mui-icon-clear', function(e) {
			$timeout(function() {
				$scope.searchResult = [];
			}, 0)
		})
		document.querySelector('.searchCancel').addEventListener('tap', function(e) {
			$timeout(function() {
				mask.close();
				searchIpt.value = '';
				$scope.searchResult = [];
				$scope.searchStatus = false;
			}, 0)

		})
		searchIpt.addEventListener('focus', function(e) {
			$timeout(function() {
				mask.show();
				$scope.searchStatus = true;
				searchScroll.style.display = 'block';
			}, 0)

		})
	})
}]);