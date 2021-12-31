function miku_img_album_touch(cfg) {
	var miku_index = 0;
	var mask_index = 0;
	var g_main = document.querySelector('#miku_img_album_main_' + cfg.pid);
	var g_bigImg = g_main.querySelector('#miku_img_album_big_img_' + cfg.pid);
	var g_imgList = g_bigImg.querySelectorAll('li');
	var g_prev = g_main.querySelector('.prev');
	var g_next = g_main.querySelector('.next');
	var g_curIndex = document.querySelector('#miku_img_album_cur_index_' + cfg.pid);
	var g_mask = document.querySelector('#miku_img_album_mask_' + cfg.pid);
	var g_mask_close = g_mask.querySelector('.close');
	var g_mask_zoom = g_mask.querySelector('.zoom');
	var g_mask_zoom_icon = g_mask.querySelector('.zoom i');
	var g_mask_loading = g_mask.querySelector('.loadding');
	var g_mask_tips = g_mask.querySelector('.tips');
	var g_mask_tipsContent = g_mask.querySelector('.tips .tips-content');
	var g_mask_img_block = g_mask.querySelector('.img-block');
	var g_mask_img_status = g_mask.querySelector('.img-status');
	var g_mask_slider = g_mask.querySelector('.img_album_solider');
	var g_mask_imgList = g_mask.querySelectorAll('.img_album_sitem');
	var g_maxImg = g_mask_imgList.length;
	var g_imgSize = {};

	//高度百分比
	cfg.heightPercent = cfg.heightPercent / 100;

	//用户滑动的时间(毫秒）、距离
	cfg.startTime = 0;
	cfg.startX = 0;
	cfg.startY = 0;
	cfg.offsetX = 0;
	cfg.offsetY = 0;

	cfg.scrollTop = 0;
	cfg.zoom = 1;
	cfg.click = 0;




	setTimeout(function () {
		//幻灯片
		g_mask_slider.swp = new Swipe(g_mask_slider, {
			speed: 400,
			startSlide: g_maxImg-1,
			callback: function (index, elem) {
				var img = elem.querySelector('img');
				mask_index = index;
				if (!elem.is_loaded) {
					img.mask_index = index;
					var path = img.getAttribute('miku-origimg-src');
					img.src = path;
					img.onerror = function () {
						this.src = "source/plugin/img_album/img/nopic.gif";
					}
					elem.is_loaded = true;
				}
				loadImg(img, zoomOut);
				setTips(index);
				showTips();
				lazyloadMaskImg();
			}

		});



		cfg.scroll_tips = new IScroll('#miku_img_album_tips_' + cfg.pid, {
			scrollX: false,
			scrollY: true
		});
		g_mask_slider.swp.slide(0, 1);
	}, 100);


	window.addEventListener('orientationchange', function (evt) {
		setTimeout(function () {
			init();
		}, 800);
	});

	init();

	function init() {
		//浏览器视口的宽高
		cfg.viewWidth = window.innerWidth;
		cfg.viewHeight = window.innerHeight;
		g_mask_img_block.style.width = "100%";

		//帖子内容区域的最大宽度、允许的图册最大高度。
		cfg.maxWidth = g_main.offsetWidth;
		var maxHeight = cfg.viewHeight * cfg.heightPercent;
		if (cfg.maxWidth > cfg.viewHeight) {
			//横屏
			cfg.maxHeight = (cfg.maxWidth * 0.65) > maxHeight ? maxHeight : (cfg.maxWidth * 0.65);
			g_mask_img_block.style.height = (cfg.viewHeight - 5) + "px";
		} else {
			//竖屏
			cfg.maxHeight = (cfg.maxWidth * 1.5) > maxHeight ? maxHeight : (cfg.maxWidth * 1.5);
			g_mask_img_block.style.height = (cfg.viewHeight - 10) + "px";

		}
		//最小高度判断
		if (cfg.maxHeight < cfg.minHeight) {
			cfg.maxHeight = cfg.minHeight;
		}

		cfg.validWidth = cfg.maxWidth / 6;


		//处理图片列表区域
		for (var i = 0; i < g_imgList.length; i++) {
			g_imgList[i].style.webkitTransform = "translate3d(" + cfg.maxWidth * (i - miku_index) + "px,0,0)";
			g_imgList[i].ontouchstart = touchStart;
			g_imgList[i].ontouchmove = touchMove;
			g_imgList[i].ontouchend = touchEnd;
			if (cfg.showStyle == 2) {
				// 固定高度
				g_imgList[i].style.height = cfg.maxHeight + 'px';
			}
			var imgDom = g_imgList[i].querySelector('img');
			if (imgDom) {
				imgDom.style.display = 'none';
				imgDom.miku_index = i;
				setImgSize(imgDom);
				imgDom.onclick = showBigImg;
				imgDom.onerror = function () {
					this.src = "source/plugin/img_album/img/nopic.gif";
					this.parentNode.querySelector('.loadding').style.display = 'none';
					this.style.display = 'inline-block';
				}
				imgDom.onload = function () {
					this.parentNode.querySelector('.loadding').style.display = 'none';
					this.style.display = 'inline-block';
				}
			}

		}

		//设置图册的宽高
		if (cfg.showStyle == 1) {
			// 高度自适应
			g_main.style.minHeight = '220px';
		} else if (cfg.showStyle == 2) {
			// 固定高度
			g_main.style.height = cfg.maxHeight + 'px';
			g_bigImg.style.height = cfg.maxHeight + 'px';
		}

		//屏幕尺寸改变时，重新设置遮罩层
		if (g_mask.style.display != 9999) {
			cfg.zoom=0;
			zoom();
		}

		//单纯为了阻止“在向右滑动时”，浏览器的“后退一步”操作。
		g_mask.ontouchstart = function (evt) {
			cfg.startX = evt.touches[0].pageX;
			cfg.startY = evt.touches[0].pageY;
			evt.preventDefault();

		}
		g_mask.ontouchmove = function (evt) {
			var scrollLeft = g_mask.scrollLeft || 0;
			cfg.offsetX = evt.touches[0].pageX - cfg.startX;
			cfg.offsetY = evt.touches[0].pageY - cfg.startY;
			evt.preventDefault();
		}

		g_mask.onclick = function (evt) {
			evt.preventDefault();
		}

		g_prev.onclick = prev;
		g_next.onclick = next;
		g_mask_zoom.ontouchend = zoom;
		g_mask_close.ontouchend = hideBigImg;
	}


	function setTips(index) {
		var srcDom = g_imgList[index].querySelector('.tips p');
		g_mask_tipsContent.innerHTML = srcDom.innerHTML;
		cfg.scroll_tips.refresh();
	}

	function hideTips() {
		g_mask_tips.style.display = "none";
		g_mask_zoom.style.color = '#25c6fc';
		g_mask_zoom_icon.className = 'iconfont icon-icon--1';
		cfg.zoom = 0;
	}

	function showTips() {
		if (g_mask_tipsContent.innerHTML != '') {
			g_mask_tips.style.display = "block";
			cfg.scroll_tips.refresh();
		}else{
			g_mask_tips.style.display = "none";
		}
		g_mask_zoom.style.color = '#77c34f';
		g_mask_zoom_icon.className = 'iconfont icon-icon--';;
		cfg.zoom = 1;
	}

	function zoom() {
		var img = g_mask_imgList[mask_index].querySelector("img");
		if (cfg.zoom == 1) {
			if(img.pinchzoomScale){
				img.pinchzoomScale("max");
			}
			showBigImgStatus(100);
			hideTips();

		} else {
			if(img.pinchzoomScale){
				img.pinchzoomScale("min");
			}else{
				showBigImgStatus(100);
			}
			showTips();

		}
	}

	function zoomIn(obj, img, ok) {
		// 放大
		setTimeout(function(){
			if (g_mask_imgList[mask_index].pzoom) {
				var max = (100/g_mask_imgList[mask_index].pzoom.miku_bili).toFixed(2);
				g_mask_imgList[mask_index].pzoom.zoomFactor = max;
				g_mask_imgList[mask_index].pzoom.update();
			}
		}, 100);
		g_mask_zoom.style.color = '#25c6fc';
		g_mask_zoom_icon.className = 'iconfont icon-icon--1';

		cfg.zoom = 0;
	}

	function zoomOut(obj, img, ok) {
		// 缩小
		var miku_bili = 100;
		var zoom_data = 1;
		if (ok) {
			var width = img['width'];
			var height = img['height'];
			var ismin = width <= cfg.viewWidth && height <= cfg.viewHeight ? true : false;

			if (width < cfg.viewWidth) {
				// 图片比容器窄
				var zw = width;
				var zh = height;
			} else {
				// 图比容器宽
				var zw = cfg.viewWidth;
				var zh = parseInt(zw / width * height);
			}

			if (zh > cfg.viewHeight) {
				// 图比容器高
				var bili = cfg.viewHeight / height;
				zh = cfg.viewHeight;
				zw = parseInt(width * bili);
			}

			zoom_data = (width / zw).toFixed(2);
			miku_bili = (zw / width * 100).toFixed(2);
			obj.style.width = zw + 'px';
			obj.style.height = zh + 'px';


			if (mask_index == obj.mask_index) {
				showBigImgStatus(parseInt(zw / width * 100),true);
			}
		}


		cfg.zoom = 1;
		g_mask_zoom.style.color = '#77c34f';
		g_mask_zoom_icon.className = 'iconfont icon-icon--';
		// g_mask_img_block.style.webkitTransform = "translate3d(0,0,0)";
		var i = obj.mask_index;
		if (ok && !ismin) {
			if(obj.pinchzoomScale){
				obj.pinchzoomScale('min', true);
			}else{
				pinchzoom(obj, width, height, zw, zh);
			}
		}else{
			obj.parentNode.className = "img_album_zoom-minimg";
		}

		// setTimeout(function() {
		// 	obj.style.opacity = 1;
		// 	g_mask_imgList[obj.mask_index].style.backgroundImage = 'url(source/plugin/img_album/img/imgplaceholder.png)';
		// }, 1000);

	}

	function showBigImgStatus(num, isSwipe){
		num = (num >= 98 && num <= 102 ? 100 : num);
		if(isSwipe){
			g_mask_img_status.innerHTML = '<span style="font-weight: normal;">' + (mask_index+1) + ' / <i>'+ g_maxImg +'</i></span>';
		}else{
			g_mask_img_status.innerHTML = '<span>' + num + '% </span>';
		}
		g_mask_img_status.style.display = 'inline-block';
		clearTimeout(g_mask_img_status.timer);
		g_mask_img_status.timer = setTimeout(function () {
			g_mask_img_status.style.display = 'none';
		}, 800);
	}

	// 点击图片显示大图“遮罩层”
	function showBigImg() {
		mask_index = miku_index;
		loadImg(g_mask_imgList[mask_index].querySelector("img"), zoomOut);
		setTips(mask_index);
		showTips(mask_index);
		g_mask.style.top = 0;
		g_mask_close.style.color = null;
		g_mask_slider.swp.slide(mask_index, 1);
		if (!g_mask.is_loaded) {

			g_mask.is_loaded = true;
		}
		lazyloadMaskImg();
	}

	// 关闭大图“遮罩层”
	function hideBigImg() {
		this.style.color = '#5d150f';

		setTimeout(function () {
			g_mask.style.top = '9999px';
			g_mask_zoom.style.color = '#77c34f';
			g_mask_zoom_icon.className = 'iconfont icon-icon--';
			cfg.zoom = 1;
		}, 350);
	}

    function pinchzoom(el, maxWidth, maxHeight, w, h){
		var touch1, touch2, fingers, startX, startY, endX, endY,pointX,pointY,imgTop,imgLeft,imgWidth,imgHeight,pinchSize,
			isOne = false,
			whBili = parseFloat(w/h),
			boxW = $(el.parentNode).width(),
			boxH = $(el.parentNode).height(),
			originLeft = 0,
			originTop = 0;

		var setImgData = function(obj){
			imgLeft = parseInt(obj.position().left);
			imgTop = parseInt(obj.position().top);
			imgWidth = obj.width();
			imgHeight = obj.height();
		}
		var moveTo = function(obj,left,top){
			obj.css({
				'transition':"left 0.2s,top 0.2s",
				'top':top,
				'left':left
			});
			setTimeout(function(){
				obj.css('transition', "");
			}, 200);
		}

		el.pinchzoomScale = function(cmd, hideStatus){
			if(cmd == 'max'){
				$(el).css({
					'transition':"left 0.4s,top 0.4s,width 0.4s,height 0.4s",
					'width':maxWidth,
					'height':maxHeight,
					'top':originTop,
					'left':originLeft
				});
				showBigImgStatus(100);
			}else if(cmd == 'min'){
				$(el).css({
					'transition':"left 0.4s,top 0.4s,width 0.4s,height 0.4s",
					'width':w,
					'height':h,
					'top':originTop,
					'left':originLeft
				});
				if(!hideStatus){
					showBigImgStatus(parseInt(w/maxWidth*100));
				}
			}
			setTimeout(function(){
				$(el).css('transition', "");
			}, 400);

		}
		$(el.parentNode).on("touchstart touchmove touchend", function(event){
			var $block = $(this).find('img');
			var evt = event.originalEvent;
			touch1 = evt.targetTouches[0];
			touch2 = evt.targetTouches[1];
			fingers = evt.touches.length;
			//手指放到屏幕上，还没有进行其他操 作时
			if(event.type == "touchstart"){
				if(fingers == 2) {
					startX = Math.abs(touch1.screenX - touch2.screenX);
					startY = Math.abs(touch1.screenY - touch2.screenY);
					isOne = false;
				}else if(fingers == 1) {
					pointX = touch1.screenX;
					pointY = touch1.screenY;
					isOne = true;
				}
				setImgData($block);

			}
			//手指在屏幕滑动
			else if(event.type == "touchmove"){
				if(fingers == 2) {
					// 缩放图片的时候X坐标滑动变化值
					endX = Math.abs(touch1.screenX - touch2.screenX);
					endY = Math.abs(touch1.screenY - touch2.screenY);
					var pinchSize = Math.abs(endX - startX) > Math.abs(endY - startY) ? endX - startX : endY - startY;
					pinchSize = parseInt(pinchSize * 1.8);
					if (imgWidth + pinchSize >= w && imgWidth + pinchSize <= maxWidth){
						$block.css({
							"width": imgWidth + pinchSize,
							"height": (imgWidth + pinchSize) / whBili,
							// "left":imgLeft,
							// "top":imgTop
						});
						showBigImgStatus(parseInt((imgWidth + pinchSize)/maxWidth * 100));
						hideTips();
					}
				}else if(fingers == 1 && isOne) {
					if(imgWidth/w > 1.25){
						var minLeft = -(imgWidth > boxW ? imgWidth - boxW : 0 ) - 20;
						var minTop = -(imgHeight > boxH ? imgHeight - boxH : 0) - 20;
						var left = parseInt(imgLeft + (touch1.screenX- pointX));
						var top = parseInt(imgTop + (touch1.screenY - pointY));

						if(left > originLeft + 20){
							left = originLeft + 20;
						}
						if(left < minLeft){
							left = minLeft;
						}
						if(top > originTop + 20 && imgHeight >=boxH){
							top = originTop + 20;
						}else if(top > originTop){
							top = originTop;
						}
						if(top < minTop){
							top = minTop;
						}

						$block.css({
							'left':left,
							'top': top
						});
						// event.preventDefault();
						event.stopPropagation();
					}
				}
			//手指离开屏幕
			}else if(event.type == "touchend"){
				setImgData($block);
				//移动调整
				var left2 = parseInt($block.css("left")),
					top2 = parseInt($block.css("top")),
					minLeft2 = -(imgWidth > boxW ? imgWidth - boxW : 0 ),
					minTop2 = -(imgHeight > boxH ? imgHeight - boxH : 0);
				if(left2 > originLeft ){
					left2 = originLeft;
				}
				if(left2 < minLeft2){
					left2 = minLeft2;
				}
				if(top2 > originTop){
					top2 = originTop;
				}
				if(top2 < minTop2){
					top2 = minTop2;
				}

				moveTo($block, left2 , top2);

				//缩放调整
				if(imgWidth/w < 1.1){
					$block.css({
						'width':w,
						'height':h,
						'left' :originLeft,
						'top' : originTop
					});
					// showBigImgStatus(parseInt(w/maxWidth * 100));
					showTips();
				}
			}
		});
	}


	function prev() {
		cfg.maxWidth = g_main.offsetWidth;
		if (miku_index - 1 < 0) {
			miku_index = 0;
			var self = 0;
			var front = 0;
			var behind = cfg.maxWidth + 'px';
		} else {
			miku_index--;
			var self = 0;
			var front = -cfg.maxWidth + 'px';
			var behind = cfg.maxWidth + 'px';
		}

		heightAutoResponse(g_imgList[miku_index]);
		g_imgList[miku_index].style.webkitTransform = "translate3d(" + self + ",0,0)";
		g_imgList[miku_index - 1] && (g_imgList[miku_index - 1].style.webkitTransform = "translate3d(" + front + ",0,0)");
		g_imgList[miku_index + 1] && (g_imgList[miku_index + 1].style.webkitTransform = "translate3d(" + behind + ",0,0)");

		g_curIndex.innerHTML = miku_index + 1;
	}
	function next() {
		cfg.maxWidth = g_main.offsetWidth;
		if (miku_index + 1 >= cfg.imgNum) {
			miku_index = cfg.imgNum - 1;
			var self = 0;
			var front = -cfg.maxWidth + 'px';
			var behind = cfg.maxWidth + 'px';
		} else {
			miku_index++;
			var self = 0;
			var front = -cfg.maxWidth + 'px';
			var behind = cfg.maxWidth + 'px';
		}
		heightAutoResponse(g_imgList[miku_index]);
		g_imgList[miku_index].style.webkitTransform = "translate3d(" + self + ",0,0)";
		g_imgList[miku_index - 1] && (g_imgList[miku_index - 1].style.webkitTransform = "translate3d(" + front + ",0,0)");
		g_imgList[miku_index + 1] && (g_imgList[miku_index + 1].style.webkitTransform = "translate3d(" + behind + ",0,0)");

		g_curIndex.innerHTML = miku_index + 1;
		lazyloadImages();
	}

	function restore() {
		cfg.maxWidth = g_main.offsetWidth;
		var self = 0;
		var front = -cfg.maxWidth + 'px';
		var behind = cfg.maxWidth + 'px';
		g_imgList[miku_index].style.webkitTransform = "translate3d(" + self + ",0,0)";
		g_imgList[miku_index - 1] && (g_imgList[miku_index - 1].style.webkitTransform = "translate3d(" + front + ",0,0)");
		g_imgList[miku_index + 1] && (g_imgList[miku_index + 1].style.webkitTransform = "translate3d(" + behind + ",0,0)");
	}



	function touchStart(evt) {
		cfg.startTime = Date.now();
		cfg.offsetX = 0;
		cfg.offsetY = 0;
		cfg.startX = evt.touches[0].pageX;
		cfg.startY = evt.touches[0].pageY;
		for (var i = 0; i < g_imgList.length; i++) {
			g_imgList[i].style.webkitTransition = "none";
		}
	}

	function touchMove(evt) {
		//兼容chrome android，阻止浏览器默认行为
		cfg.offsetX = evt.touches[0].pageX - cfg.startX;
		cfg.offsetY = evt.touches[0].pageY - cfg.startY;
		if (Math.abs(cfg.offsetX) > Math.abs(cfg.offsetY)) {
			evt.preventDefault();
		}
		g_imgList[miku_index].style.webkitTransform = "translate3d(" + cfg.offsetX + "px,0,0)";
		g_imgList[miku_index - 1] && (g_imgList[miku_index - 1].style.webkitTransform = "translate3d(" + (-cfg.maxWidth + cfg.offsetX) + "px,0,0)");
		g_imgList[miku_index + 1] && (g_imgList[miku_index + 1].style.webkitTransform = "translate3d(" + (cfg.maxWidth + cfg.offsetX) + "px,0,0)");
	}

	function touchEnd() {
		for (var i = 0; i < g_imgList.length; i++) {
			g_imgList[i].style.webkitTransition = "-webkit-transform 0.2s ease-out";
		}
		//快速切换
		if (Date.now() - cfg.startTime >= 200) {
			if (cfg.offsetX > cfg.validWidth) {
				// 上一页
				prev();
			} else if (cfg.offsetX < -cfg.validWidth) {
				// 下一页
				next();
			} else {
				// 无效滑动，保持当前页面。
				restore();
			}
		} else {
			if (cfg.offsetX > 50) {
				// 上一页
				prev();
			} else if (cfg.offsetX < -50) {
				// 下一页
				next();
			} else {
				// 无效滑动，保持当前页面。
				restore();
			}
		}
	}

	function heightAutoResponse(obj) {
		if (cfg.showStyle == 1) {
			if (obj.offsetHeight < cfg.minHeight) {
				// 最小高度
				g_bigImg.style.height = cfg.minHeight + 'px';
			} else {
				g_bigImg.style.height = obj.offsetHeight + 'px';
			}
		}
	}


	function setImgSize(obj, img, count) {
		if (obj.timer) {
			clearTimeout(obj.timer);
		}

		var index = obj.miku_index;
		var count = count ? count : 1;
		if (count == 1) {
			if (cfg.maxWidth / cfg.maxHeight <= 1) {
				// 图册：宽 < 高
				obj.style.maxWidth = cfg.maxWidth + 'px';
				obj.style.maxHeight = 'none';
			} else {
				// 图册：宽 > 高
				obj.style.maxHeight = cfg.maxHeight + 'px';
				obj.style.maxWidth = 'none';
			}
		}

		if (g_imgSize[index]) {
			var width = g_imgSize[index]['width'];
			var height = g_imgSize[index]['height'];
		} else {
			if (!img) {
				var img = new Image();
				img.src = obj.src;
			}
			var width = img['width'];
			var height = img['height'];
		}

		if (width < 2) {
			if (count > 50) {
				//加载不到图片
				obj.src = 'source/plugin/img_album/img/nopic.gif';
			} else {
				count++;
				obj.timer = setTimeout(function () {
					setImgSize(obj, img, count);
				}, 1000);
				return;
			}
		} else {
			g_imgSize[index] = { 'width': width, 'height': height };

			//大图缩放尺寸
			if (width < cfg.maxWidth) {
				var zw = width;
				var zh = height;
			} else {
				var zw = cfg.maxWidth;
				var zh = parseInt(zw / width * height);
			}
			if (zh > cfg.maxHeight) {
				var bili = cfg.maxHeight / height;
				zh = cfg.maxHeight;
				zw = parseInt(width * bili);
			}
			obj.style.maxHeight = 'none';
			obj.style.maxWidth = 'none';
			obj.style.height = zh + 'px';
			obj.style.width = zw + 'px';
		}
		obj.parentNode.querySelector('.loadding').style.display = 'none';
		obj.style.display = 'inline-block';
		//高度自适应
		if (obj.miku_index == miku_index) {
			heightAutoResponse(g_imgList[miku_index]);
		}
	}

	function loadImg(obj, func, img, count) {
		if (obj.timer) {
			clearTimeout(obj.timer);
		}

		var count = count ? count : 1;
		if (!img) {
			var img = new Image();
			img.src = obj.src;
		}

		var width = img['width'];
		var height = img['height'];
		var ok = true;
		if (width < 5 && height < 10) {
			if (count > 100) {
				//加载不到图片
				obj.src = 'source/plugin/img_album/img/nopic.gif';
				ok = false;
			} else {
				count++;
				obj.timer = setTimeout(function () {
					loadImg(obj, func, img, count);
				}, 100);
				return;
			}
		}
		if (func) {
			func(obj, img, ok);
		}
	}
	function lazyloadMaskImg(){
		var p_elem = g_mask_imgList[mask_index-1];
		var n_elem = g_mask_imgList[mask_index+1];
		if (p_elem && !p_elem.is_loaded) {
			var p_img = p_elem.querySelector('img');
			p_img.mask_index = mask_index - 1;
			var path = p_img.getAttribute('miku-origimg-src');
			p_img.src = path;
			p_img.onerror = function () {
				this.src = "source/plugin/img_album/img/nopic.gif";
			}
			p_elem.is_loaded = true;
			loadImg(p_img, zoomOut);
		}
		if (n_elem && !n_elem.is_loaded) {
			var n_img = n_elem.querySelector('img');
			n_img.mask_index = mask_index + 1;
			var path = n_img.getAttribute('miku-origimg-src');
			n_img.src = path;
			n_img.onerror = function () {
				this.src = "source/plugin/img_album/img/nopic.gif";
			}
			n_elem.is_loaded = true;
			loadImg(n_img, zoomOut);
		}
	}

	var loaded = 4; //记录小图片已加载到第几个单位
	function lazyloadImages() {
		//小图列表中的 网络图片延时加载
		var cur = miku_index + 4;
		if (cur > loaded && cur < cfg.imgNum) {
			loaded = cur;
			var imgObj = null;
			imgObj = g_imgList[cur].querySelector('img');
			imgObj.src = imgObj.getAttribute('miku-origimg-src');
			lazyload_setImgSize(imgObj);
		}
	}


	function lazyload_setImgSize(obj, img, count) {
		if (obj.timer) {
			clearTimeout(obj.timer);
		}
		var count = count ? count : 1;
		if (count == 1) {
			if (cfg.maxWidth / cfg.maxHeight <= 1) {
				// 图册：宽 < 高
				obj.style.maxWidth = cfg.maxWidth + 'px';
				obj.style.maxHeight = 'none';
				obj.style.height = 'auto';
				obj.style.width = 'auto';
			} else {
				// 图册：宽 > 高
				obj.style.maxHeight = cfg.maxHeight + 'px';
				obj.style.maxWidth = 'none';
				obj.style.height = 'auto';
				obj.style.width = 'auto';
			}
		}
		if (!img) {
			var img = new Image();
			img.src = obj.src;
		}
		var width = img['width'];
		var height = img['height'];
		if (width < 2) {
			if (count > 50) {
				//加载不到图片
				obj.src = 'source/plugin/img_album/img/nopic.gif';
			} else {
				count++;
				obj.timer = setTimeout(function () {
					lazyload_setImgSize(obj, img, count);
				}, 1000);
				return;
			}
		} else {
			//大图缩放尺寸
			if (width < cfg.maxWidth) {
				var zw = width;
				var zh = height;
			} else {
				var zw = cfg.maxWidth;
				var zh = parseInt(zw / width * height);
			}
			if (zh > cfg.maxHeight) {
				var bili = cfg.maxHeight / height;
				zh = cfg.maxHeight;
				zw = parseInt(width * bili);
			}
			obj.style.maxHeight = 'none';
			obj.style.maxWidth = 'none';
			obj.style.height = zh + 'px';
			obj.style.width = zw + 'px';
		}

		//高度自适应
		if (obj.miku_index == miku_index) {
			heightAutoResponse(g_imgList[miku_index]);
		}
	}
}
