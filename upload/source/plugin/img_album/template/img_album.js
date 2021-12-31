function miku_img_album (cfg, lang, miku_img_info, miku_tips_arr, miku_remote_img)
{	
	cfg.tuce_middle_grid_num =  (Math.ceil(cfg.tuce_grid_num/2));
	cfg.play_time = (cfg.play_time < 2000 || cfg.play_time > 9000) ? 3500 : cfg.play_time;
	cfg.old_play_time = cfg.play_time;

	var miku_index = 1;
	var g_album = $("miku_img_album_"+ cfg.pid);
	var g_big_img_block = $("miku_img_album_big_img_block_"+ cfg.pid);
	var g_big_img_tag = $("miku_img_album_big_img_"+ cfg.pid);
	var g_prev = $("miku_img_album_prev_"+ cfg.pid);
	var g_next = $("miku_img_album_next_"+ cfg.pid);

	var g_album_tool = $("miku_img_album_tool_"+ cfg.pid);
	var g_tool_zoom_btn = $C('zoom-btn', g_album_tool)[0];
	var g_tool_zoom_box = $("zoom_box_"+ cfg.pid);
	var g_tool_zoom_box_img = $C('zoom_box_img', g_tool_zoom_box)[0];
	var g_tool_play_btn = $C('play-btn', g_album_tool)[0];
	var g_tool_prev_btn = $C('tool-prev', g_album_tool)[0];
	var g_tool_next_btn = $C('tool-next', g_album_tool)[0];
	var g_tool_num_cur = $C('num_cur', g_album_tool)[0];

	var g_tip_block = $("miku_img_album_tip_"+ cfg.pid);
	var g_tip_notice = $("miku_img_album_tip_notice_"+ cfg.pid);
	var g_tip_content = $("miku_img_album_tip_content_"+ cfg.pid);
	var g_tip_close = $("miku_img_album_tip_close_"+ cfg.pid);
	var g_tip_open = $("miku_img_album_tip_open_"+ cfg.pid);
	var g_tip_dialog = $("miku_img_album_tip_dialog_"+ cfg.pid);
	var g_tip_dialog_content = g_tip_dialog.getElementsByTagName("p")[0];
	var g_tip_dialog_open = g_tip_notice.getElementsByTagName("span")[0];
	var g_tip_dialog_close = $("miku_img_album_tip_dialog_close_"+ cfg.pid);



	var g_sm_img_block = $("miku_img_album_sm_img_block_"+ cfg.pid);
	var g_sm_img_list = $("miku_img_album_sm_img_list_"+ cfg.pid);
	var g_sm_prev = $("miku_img_album_sm_prev_"+ cfg.pid);
	var g_sm_next = $("miku_img_album_sm_next_"+ cfg.pid);

	var g_loading = $("miku_img_album_loading_"+ cfg.pid);
	var g_msg = $("miku_img_album_msg_"+ cfg.pid);
	var g_timer = null; //设置大图的定时器
	var g_url_nopic= "source/plugin/img_album/img/nopic.gif";
	var g_url_loading = "source/plugin/img_album/img/loading.gif";

	function transfrom_next_img(){
		miku_index++;
		if(miku_index > cfg.img_total){
			miku_index=1;
		}
		img_album_change();
	}

	function transfrom_prev_img(){
		miku_index--;
		if(miku_index < 1){
			miku_index = 1;
			//弹出提示信息：已经是第一页
			clearTimeout(g_msg.timer);
			g_msg.innerHTML = lang.is_first_page;
			g_msg.style.display="block";
			g_msg.timer = setTimeout(function(){
				g_msg.style.display="none";
			},1000);
			return;
		}
		img_album_change();
	}

	function transfrom_to_index(){
		var index = this.index;
		if(miku_index==index){
			return;
		}else{
			miku_index=index;
			img_album_change();
		}
	}

	function img_album_change(is_first){

		//大图的切换
		var big_img_info = miku_img_info[miku_index-1];

		if (g_big_img_tag.timer) {
			clearInterval(g_big_img_tag.timer);
		}

		miku_fadeOut(g_big_img_tag);
		miku_loadBigImg( 1 , function(){
			//设置大图缩放尺寸
			if( !big_img_info['b_zoom_width'] || big_img_info['b_zoom_width'] == '0'){
				// 网络图片
				miku_setBigImgSize(g_big_img_tag, 1, miku_index-1);
			}else{
				g_big_img_tag.style.width = big_img_info['b_zoom_width']+'px';//垂直居中
				g_big_img_tag.style.height = big_img_info['b_zoom_height']+'px';
				if(cfg.height_mode == 1){
					g_big_img_tag.parentNode.style.paddingTop = big_img_info['b_padding_top']+'px';
				}else{
					g_big_img_tag.parentNode.style.marginTop = big_img_info['ext_margin_top']+'px';
					g_big_img_tag.parentNode.style.marginBottom = big_img_info['ext_margin_bottom']+'px';
				}
			}
			miku_fadeIn(g_big_img_tag, cfg.transform_speeds);
		});

		//预加载小图列表中的小图
		miku_loadSmallImg();
		//小图列表的切换
		var will_list_left = 0;
		if(miku_index <= cfg.tuce_middle_grid_num || cfg.img_total <= cfg.tuce_grid_num){
			will_list_left = 0;
		}else if(miku_index+(cfg.tuce_grid_num- cfg.tuce_middle_grid_num) > cfg.img_total){
			will_list_left = -(cfg.img_total - cfg.tuce_grid_num)*(cfg.sm_img_width + cfg.sm_img_margin);
		}else{
			will_list_left = -(miku_index - cfg.tuce_middle_grid_num)*(cfg.sm_img_width + cfg.sm_img_margin);
		}

		if (g_sm_img_list.timer) {
			clearInterval(g_sm_img_list.timer);
		}

		g_sm_img_list.timer = setInterval(function(){
			var cur_list_left = parseInt(miku_getStyle(g_sm_img_list, 'left'));
			if(cur_list_left == will_list_left){
				clearInterval(g_sm_img_list.timer);
			}
			var speed=(will_list_left - cur_list_left)/3;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
			g_sm_img_list.style.left= cur_list_left + speed + 'px';
		},30);

		//设置小图列表的边框
		var lis = g_sm_img_list.getElementsByTagName('li');
		for (var i=0; i < lis.length ; i++) {
			lis[i].className = "";
		}
		lis[miku_index-1].className = "img_album_active";

		//显示图片注释
		if(miku_tips_arr != null){
			miku_setImgTips(miku_index-1);
		}

		if(cfg.play_mode == 1 && !is_first){
			pause();
			play();
		}

		g_tool_num_cur.innerHTML = miku_index;
	}



	function miku_setImgTips(index){
		if (g_tip_block.timer) {
			clearInterval(g_tip_block.timer);
		}

		//图注的弹窗区域设为隐藏
		g_tip_block.style.display="none";
		g_tip_dialog.style.display="none";
		g_tip_notice.style.display="none";
		g_tip_close.className="close-hide";
		g_tip_block.onmouseover = function(){
			g_tip_close.className="close";
		}
		g_tip_block.onmouseout = function(){
			g_tip_close.className="close-hide";
		}

		if( !miku_tips_arr[index] || miku_tips_arr[index] ==""){
			return;
		}

		g_tip_content.innerHTML =  miku_tips_arr[index];
		g_tip_block.style.display="block";

		setTimeout(function(){
			//获得注释盒子的高度,和行高
			var box_height = g_tip_content.offsetHeight;
			var lineHeight= parseInt(miku_getStyle(g_tip_content, "line-height"));
			lineHeight= lineHeight ? lineHeight : 22; //默认行高为22px
			// 有几行注释
			var lineNum = Math.round(box_height/lineHeight);

			//设置注释盒子的初始高度
			g_tip_block.style.height = (lineHeight*2)+"px";
			if(lineNum > 6){
				g_tip_block.onmouseover = function(){
					miku_slideTipsHeight(g_tip_block, lineHeight*6,function(){
						g_tip_notice.style.display="block";
					});
					g_tip_close.className="close";
				}

				g_tip_block.onmouseout = function () {
					miku_slideTipsHeight(g_tip_block, lineHeight*2,function(){
						g_tip_notice.style.display="none";
					});
					g_tip_close.className="close-hide";
				}
			}else if(lineNum > 2){
				g_tip_block.style.height = (lineHeight*2)+"px";
				g_tip_block.onmouseover = function(){
					miku_slideTipsHeight(g_tip_block, box_height);
					g_tip_close.className="close";
				}

				g_tip_block.onmouseout = function () {
					miku_slideTipsHeight(g_tip_block, lineHeight*2);
					g_tip_close.className="close-hide";
				}

			}else if (lineNum == 1){
				g_tip_block.style.height = lineHeight+"px";
			}		

		},50);
	}


	function miku_slideTipsHeight(tip_obj, height,callback){
		if (tip_obj.timer) {
			clearInterval(tip_obj.timer);
		}

		tip_obj.timer = setInterval(function(){
			var padding = 7;
			var cur_height = tip_obj.offsetHeight - padding;
			if(cur_height == height){
				clearInterval(tip_obj.timer);
				if(callback!=undefined){
					callback();
				}
			}
			var speed=(height - cur_height)/3;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
			tip_obj.style.height= cur_height + speed + 'px';
		},30);
	}


	function miku_setBigImgSize(obj, count, index){
		g_loading.style.display="block";

		if(!obj) {
			return;
		}
		if(g_timer){
			clearTimeout(g_timer);
		}
		var img=new Image();
		img.src=obj.src;
		var zw =img.width;
		var zh =img.height;

		if(zw < 2) {
			if(count > 100){
				 g_loading.style.display="none";
				return;
			}else{
				count++;
				g_timer = setTimeout(function(){
					miku_setBigImgSize(obj, count, index);
				}, 50);
				return;
			}
		}
		g_loading.style.display="none";

		//大图缩放尺寸
		if(zw < cfg.tuce_width_px ){
			var zw_b = zw;
			var zh_b = zh;
		}else {
			var zw_b = cfg.tuce_width_px ;
			var zh_b = parseInt(zw_b/zw*zh);
		}
		if(zh_b > cfg.big_img_height){
			var bili=cfg.big_img_height/zh;
			zh_b = cfg.big_img_height;
			zw_b = parseInt(zw*bili);

		}
		obj.style.width = zw_b+"px";
		obj.style.height = zh_b+"px";
		miku_img_info[index]['b_zoom_width'] =  zw_b;
		miku_img_info[index]['b_zoom_height'] = zh_b;

		//固定高度下 要 垂直居中
		if(cfg.height_mode == 1){
			var padding_top = parseInt((cfg.big_img_height - zh_b)/2);
			obj.parentNode.style.paddingTop =padding_top+'px';
			miku_img_info[index]['b_padding_top'] = padding_top;
		}
		//高度自适应模式 && 图片高度小于最小高度 也要 垂直居中
		if(cfg.height_mode == 2 && zh_b < cfg.big_img_min_height){
			var cha = parseInt((cfg.big_img_min_height - zh_b)/2);
			obj.parentNode.style.marginTop = cha +"px";
			obj.parentNode.style.marginBottom = cha +"px";
			//将数据记录到存放图片信息的数组
			miku_img_info[index]['ext_margin_top']= cha;
			miku_img_info[index]['ext_margin_bottom']= cha;
		}else{
			obj.parentNode.style.marginTop=0;
			obj.parentNode.style.marginBottom=0;
			//将数据记录到存放图片信息的数组
			miku_img_info[index]['ext_margin_top']=0;
			miku_img_info[index]['ext_margin_bottom']=0;
		}

	}


	function miku_setSmallImgSize(obj,count){
		if(!obj) {
			return;
		}

		var img=new Image();
		img.src=obj.src;
		var zw =img.width;
		var zh =img.height;
		if(zw < 2) {
			if(count > 500){
				return;
			}else{
				count++;
				setTimeout(function(){
					miku_setSmallImgSize(obj,count);
				}, 100);
				return;
			}
		}

		//计算小图的尺寸
		if(zw < cfg.sm_img_width && zh < cfg.sm_img_height){
			var  zw_s = zw;
			var zh_s = zh;
		}else if(zw > zh){
			var zh_s = cfg.sm_img_height;
			var zw_s = parseInt(zh_s/zh*zw);
			if(zw_s < cfg.sm_img_width){
				zw_s = cfg.sm_img_width;
				zh_s =  parseInt(zw_s/zw*zh);
			}
		}else{
			var zw_s = cfg.sm_img_width;
			var zh_s = parseInt(zw_s/zw*zh);
		}
		obj.width = zw_s;
		obj.height = zh_s;
	}


	function miku_fadeIn(obj, speed){
		if(obj.timer){
			clearInterval(obj.timer);
		}
		var s=0;
		var cur_opacity=0;
		obj.timer = setInterval(function(){
			s = Math.ceil((100 - cur_opacity)/speed);
			cur_opacity = cur_opacity + s ;
			if (obj.style.opacity != undefined) {
				//兼容FF和GG和新版本IE
				obj.style.opacity = cur_opacity / 100;
			} else {
				//兼容老版本ie
				obj.style.filter = "alpha(opacity=" + cur_opacity + ")";
			}

			if(cur_opacity >= 100){
				clearInterval( obj.timer);
			}
		}, 30);

	}

	function miku_fadeOut(obj){
		if (obj.style.opacity != undefined) {
			obj.style.opacity = 0;
		} else {
			obj.style.filter = "alpha(opacity=0)";
		}
	}

	function miku_fadeTo(obj, opacity){ /*opacity取值：0~1*/
		if (obj.style.opacity != undefined) {
			obj.style.opacity = opacity;
		} else {
			opacity = opacity*100;
			obj.style.filter = "alpha(opacity="+opacity+")";
		}
	}


	function miku_loadBigImg(count, callback){
		if(g_timer){
			clearTimeout(g_timer);
		}
		//加载当前浏览的图片
		if(miku_img_info[miku_index-1]['loaded'] != true){
			g_loading.style.display="block";
			var img=new Image();
			img.index = miku_index-1;
			img.onerror=function(){
				this.onerror = null;
				miku_img_info[this.index]['origPath'] = g_url_nopic;
			}
			img.src = miku_img_info[miku_index-1]['origPath'];
			var w =img.width;

			if(w < 2) {
				if(count > 1000){
					g_loading.style.display="none";
					miku_img_info[miku_index-1]['loaded']=true;
				}else{
					count++;
					g_timer=setTimeout(function(){
						miku_loadBigImg(count,callback);
					}, 100);
					return;
				}

			}else{
				miku_img_info[miku_index-1]['loaded']=true;
			}
		}

		g_big_img_tag.src="";
		g_big_img_tag.src=miku_img_info[miku_index-1]['origPath'];

		setTimeout(function(){
			g_loading.style.display="none";
			if(callback!=undefined){
				callback();
			}
		},100);
	}

	var loaded=0; //记录小图片已加载到第几个单位
	function miku_loadSmallImg(){
		//小图列表中的 网络图片延时加载
		var cur = Math.floor(miku_index / cfg.tuce_middle_grid_num);
		if(cur >=1 && cur > loaded){
			loaded = cur;
			var imgObj=null;
			for (var i = cur*cfg.tuce_middle_grid_num; i < (cur*cfg.tuce_middle_grid_num) + cfg.tuce_grid_num; i++) {
				// if(i >= cfg.tuce_grid_num && i < cfg.img_total && miku_img_info [i]["thumb_src"] == ""){
				if(i >= cfg.tuce_grid_num && i < cfg.img_total){
					imgObj = $("miku_img_album_sm_img_" + cfg.pid +'_' + i);
					imgObj.parentNode.style.backgroundImage = "url("+ g_url_loading +")";

					imgObj.style.display="none";

					imgObj.onload = function(){
						this.parentNode.style.backgroundImage = 'none';
						this.style.display="block";
					}
					imgObj.onerror = function(){
						this.onerror=null;
						this.src = g_url_nopic;
						this.style.display="block";
						this.width = cfg.sm_img_width;
						this.height = cfg.sm_img_height;
					}

					imgObj.src = miku_img_info[i]["thumbPath"];
					miku_setSmallImgSize(imgObj,1);
				}
			}
		}
	}

	function miku_getStyle(obj,attr){
		var value = 0;
		if(obj.currentStyle){
			value=obj.currentStyle[attr];
		}else{
			value=getComputedStyle(obj, false)[attr];
		}
		return value;
	}


	// 幻灯片播放操作
	var g_album_timer = null;
	var g_album_timer2 = null;
	function play(time){
		time = time || cfg.play_time;
		if(cfg.play_mode == 1){
			clearTimeout(g_album_timer2);
			g_album_timer2 = setTimeout(function(){
				transfrom_next_img();
			}, time );
		}else if(cfg.play_mode == 2){
			clearInterval(g_album_timer);				
			g_album_timer = setInterval(transfrom_next_img, time);
		}
	}

	function pause(){
		clearInterval(g_album_timer);
		clearTimeout(g_album_timer2);
	}

	//图册初始化
	function initImageAblum(){
		//上一张 下一张按钮
		g_prev.onclick=transfrom_prev_img;
		g_sm_prev.onclick=transfrom_prev_img;
		g_next.onclick=transfrom_next_img;
		g_sm_next.onclick=transfrom_next_img;
		g_tool_prev_btn.onclick=transfrom_prev_img;
		g_tool_next_btn.onclick=transfrom_next_img;

		//点击小图时，显示本小图
		var img_list = g_sm_img_list.getElementsByTagName("li");
		for(i=0;i<img_list.length; i++){
			img_list[i].index = i+1;
			img_list[i].onclick = transfrom_to_index;
		}

		//显示图册的工具栏
		g_album.onmouseover = function(){
			if(cfg.play_mode == 0){
				g_album_tool.style.display="block";
			}else if(cfg.play_mode == 1){
				g_album_tool.style.display="block";
				cfg.play_time = 6000;
			}else if(cfg.play_mode == 2){
				g_album_tool.style.display="block";
				pause();
			}
		}
		g_album.onmouseout = function(){
			if(cfg.play_mode == 0){
				g_album_tool.style.display="none";
			}else if(cfg.play_mode == 1){
				cfg.play_time = cfg.old_play_time;
			}else if(cfg.play_mode == 2){
				g_album_tool.style.display="none";
				play();
			}
		}
		//查看原图
		g_tool_zoom_btn.onclick = function(){
			console.log('g_tool_zoom_btn.onclick')
			miku_zoom(g_big_img_tag, g_big_img_tag.src, 0, 0, 0);
			// zoom_box(miku_index);
		}

		//第一张图片的样式
		if(!miku_img_info[0]["b_zoom_width"]){
			if(cfg.height_mode != 1){
				g_big_img_tag.parentNode.style.marginTop = cfg.big_img_min_height/2+"px";
				g_big_img_tag.parentNode.style.marginBottom = cfg.big_img_min_height/2+"px";
			}
		}

		//调用图片切换函数，初始化第一幅图片的宽、高、图注等信息。
		img_album_change(true);

		//图片注释的关闭、显示按钮
		g_tip_close.onclick = function(){
			g_tip_block.style.left="-100%";
			g_tip_open.className="open";
		}
		g_tip_open.onclick = function(){
			g_tip_block.style.left="0px";
			g_tip_open.className="open-hide";
		}
		g_tip_open.onmouseover = function(evt){
			var event= evt ? evt : window.event;
			if(event && event.stopPropagation) {
			    event.stopPropagation();
			} else {
			    event.cancelBubble = true;
			}
		}

		//图片注释的弹出窗口
		g_tip_dialog_open.onclick=function(){
			g_tip_dialog.style.display ="block";
			g_tip_dialog_content.innerHTML = g_tip_content.innerHTML;
		};
		g_tip_dialog_close.onclick = function(){
			g_tip_dialog.style.display="none";
		}

		//为了美观考虑（注释文本两边的空白尽量相同），初始化图注区域的padding属性
		//注释字体大小14px，预期的padding值为：12px+12px，求最接近12px的padding（要考虑到美观因素）
	 	var tips_padding = (cfg.tuce_width_px - Math.round((cfg.tuce_width_px -24)/14)*14)/2;
	 	g_tip_content.style.paddingLeft=  tips_padding +"px";
	 	g_tip_content.style.paddingRight= tips_padding +"px";

		//头像区域在fixed定位后，其头像菜单会被图册遮挡，设置z-index,
		favatar_obj=$('favatar' + cfg.pid);
		if (favatar_obj != null) {
			favatar_obj.className+=' miku_img_album_z_index';
		}

		//按比例缩放小网络图片
		setTimeout(function(){
			for(var i=0; i<miku_remote_img.length; i++){
				miku_setSmallImgSize($('miku_img_album_sm_img_'+ cfg.pid +'_'+ miku_remote_img[i]), 1);
			}
		}, 100);


		// 幻灯片播放
		if(cfg.play_mode != 0 ){
			play(6000);
		}
		g_tool_play_btn.onclick = function(){
			if(cfg.play_mode == 1){
				cfg.play_mode = 0;
				g_tool_play_btn.title = lang.tip_play;
				g_tool_play_btn.className="play-btn play";
				g_album_tool.style.display = 'block';
				pause();
			}else{
				cfg.play_mode = 1;
				g_tool_play_btn.title= lang.tip_pause;
				g_tool_play_btn.className="play-btn pause";
				play();
			}
		}

	}
	initImageAblum();	
	//1.5bug修复
	if(miku_tips_arr == null){
		g_tip_block.style.display = "none";
	}
	


	var zoomstatus = 1;
	var zoom_index, zoom_prev_index, zoom_next_index;
	function miku_zoom(obj, zimg, nocover, pn, showexif, zoombox) {
		zoom_index = zoombox ? zoom_index : miku_index-1;
		zoom_prev_index = zoom_index - 1 >= 0 ? zoom_index - 1: cfg.img_total - 1;
		zoom_next_index = zoom_index + 1 >= cfg.img_total ? 0 : zoom_index + 1;
		console.log("miku_zoom", zoom_index, zoom_prev_index, zoom_next_index)
		
		zimg = !zimg ? obj.src : zimg;
		showexif = !parseInt(showexif) ? 0 : showexif;
		if(!zoomstatus) {
			window.open(zimg, '', '');
			return;
		}
		if(!obj.id) obj.id = 'img_' + Math.random();
		var faid = !obj.getAttribute('aid') ? 0 : obj.getAttribute('aid');
		var menuid = 'miku_imgzoom';
		var menu = $(menuid);
		var zoomid = menuid + '_zoom';
		var imgtitle = !nocover && obj.title ? '<div class="imgzoom_title">' + htmlspecialchars(obj.title) + '</div>' +
			(showexif ? '<div id="' + zoomid + '_exif" class="imgzoom_exif" onmouseover="this.className=\'imgzoom_exif imgzoom_exif_hover\'" onmouseout="this.className=\'imgzoom_exif\'"></div>' : '')
			: '';
		var cover = !nocover ? 1 : 0;
		var pn = !pn ? 0 : 1;
		var maxh = (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight) - 70;
		var loadCheck = function (obj) {
			if(obj.complete) {
				var imgw = loading.width;
				var imgh = loading.height;
				var r = imgw / imgh;
				var w = document.body.clientWidth * 0.95;
				w = imgw > w ? w : imgw;
				var h = w / r;
				if(w < 1 & h < 1) {
					$(menuid + '_waiting').style.display = 'none';
					hideMenu();
					return;
				}
				if(h > maxh) {
					h = maxh;
					w = h * r;
				}
				if($(menuid)) {
					$(menuid).removeAttribute('top_');$(menuid).removeAttribute('left_');
					clearTimeout($(menuid).getAttribute('timer'));
				}
				showimage(zimg, w, h, imgw, imgh);
				if(showexif && faid) {
					var x = new Ajax();
					x.get('forum.php?mod=ajax&action=exif&aid=' + faid + '&inajax=1', function(s, x) {
						if(s) {
							$(zoomid + '_exif').style.display = '';
							$(zoomid + '_exif').innerHTML = s;
						} else {
							$(zoomid + '_exif').style.display = 'none';
						}
					});
				}
			} else {
				setTimeout(function () { loadCheck(loading); }, 100);
			}
		};
		var showloading = function (zimg, pn) {
			if(!pn) {
				if(!$(menuid + '_waiting')) {
					waiting = document.createElement('img');
					waiting.id = menuid + '_waiting';
					waiting.src = IMGDIR + '/imageloading.gif';
					waiting.style.opacity = '0.8';
					waiting.style.filter = 'alpha(opacity=80)';
					waiting.style.position = 'absolute';
					waiting.style.zIndex = '100000';
					$('append_parent').appendChild(waiting);
				}
			}
			$(menuid + '_waiting').style.display = '';
			$(menuid + '_waiting').style.left = (document.body.clientWidth - 42) / 2 + 'px';
			$(menuid + '_waiting').style.top = ((document.documentElement.clientHeight - 42) / 2 + Math.max(document.documentElement.scrollTop, document.body.scrollTop)) + 'px';
			loading = new Image();
			setTimeout(function () { loadCheck(loading); }, 100);
			if(!pn) {
				$(menuid + '_zoomlayer').style.display = 'none';
			}
			loading.src = zimg;
		};
		var adjustpn = function(h) {
			h = h < 90 ? 90 : h;
			if($('zimg_prev')) {
				$('zimg_prev').style.height= parseInt(h) + 'px';
			}
			if($('zimg_next')) {
				$('zimg_next').style.height= parseInt(h) + 'px';
			}
		};
		var showimage = function (zimg, w, h, imgw, imgh) {
			$(menuid + '_waiting').style.display = 'none';
			$(menuid + '_zoomlayer').style.display = '';
			$(menuid + '_img').style.width = 'auto';
			$(menuid + '_img').style.height = 'auto';
			$(menuid).style.width = (w < 300 ? 320 : w + 20) + 'px';
			mheight = h + 63;
			menu.style.height = mheight + 'px';
			$(menuid + '_zoomlayer').style.height = (mheight < 120 ? 120 : mheight) + 'px';
			$(menuid + '_img').innerHTML = '<img id="' + zoomid + '" w="' + imgw + '" h="' + imgh + '">' + imgtitle;
			$(zoomid).src = zimg;
			$(zoomid).width = w;
			$(zoomid).height = h;
			if($(menuid + '_imglink')) {
				$(menuid + '_imglink').href = zimg;
			}
			setMenuPosition('', menuid, '00');
			adjustpn(h);
		};
		var adjustTimer = 0;
		var adjustTimerCount = 0;
		var wheelDelta = 0;
		var clientX = 0;
		var clientY = 0;
		var adjust = function(e, a) {
			if(BROWSER.ie && BROWSER.ie<7) {
			} else {
				if(adjustTimerCount) {
					adjustTimer = (function(){
						return setTimeout(function () {
							adjustTimerCount++;
							adjust(e);
						}, 20);
						})();
						$(menuid).setAttribute('timer', adjustTimer);
					if(adjustTimerCount > 17) {
						clearTimeout(adjustTimer);
						adjustTimerCount = 0;
						doane();
					}
				} else if(!a) {
					adjustTimerCount = 1;
					if(adjustTimer) {
						clearTimeout(adjustTimer);
						adjust(e, a);
					} else {
						adjust(e, a);
					}
					doane();
				}
			}
			var ele = $(zoomid);
			if(!ele) {
				return;
			}
			var imgw = ele.getAttribute('w');
			var imgh = ele.getAttribute('h');

			if(!a) {
				e = e || window.event;
				try {
					if(e.altKey || e.shiftKey || e.ctrlKey) return;
				} catch (e) {
					e = {'wheelDelta':wheelDelta, 'clientX':clientX, 'clientY':clientY};
				}
				var step = 0;
				if(e.wheelDelta <= 0 || e.detail > 0) {
					if(ele.width - 1 <= 200 || ele.height - 1 <= 200) {
						clearTimeout(adjustTimer);
						adjustTimerCount = 0;
						doane(e);return;
					}
					step = parseInt(imgw/ele.width)-4;
				} else {
					if(ele.width + 1 >= imgw*40) {
						clearTimeout(adjustTimer);
						adjustTimerCount = 0;
						doane(e);return;
					}
					step = 4-parseInt(imgw/ele.width) || 2;
				}
				if(BROWSER.ie && BROWSER.ie<7) { step *= 5;}
				wheelDelta = e.wheelDelta;
				clientX = e.clientX;
				clientY = e.clientY;
				var ratio = 0;
				if(imgw > imgh) {
					ratio = step/ele.height;
					ele.height += step;
					ele.width = imgw*(ele.height/imgh);
				} else {
					ratio = step/ele.width;
					ele.width += step;
					ele.height = imgh*(ele.width/imgw);
				}
				if(BROWSER.ie && BROWSER.ie<7) {
					setMenuPosition('', menuid, '00');
				} else {
					var menutop = parseFloat(menu.getAttribute('top_') || menu.style.top);
					var menuleft = parseFloat(menu.getAttribute('left_') || menu.style.left);
					var imgY = clientY - menutop - 39;
					var imgX = clientX - menuleft - 10;
					var newTop = (menutop - imgY*ratio) + 'px';
					var newLeft = (menuleft - imgX*ratio) + 'px';
					menu.style.top = newTop;
					menu.style.left = newLeft;
					menu.setAttribute('top_', newTop);
					menu.setAttribute('left_', newLeft);
				}
			} else {
				ele.width = imgw;
				ele.height = imgh;
			}
			menu.style.width = (parseInt(ele.width < 300 ? 300 : parseInt(ele.width)) + 20) + 'px';
			var mheight = (parseInt(ele.height) + 50);
			menu.style.height = mheight + 'px';
			$(menuid + '_zoomlayer').style.height = (mheight < 120 ? 120 : mheight) + 'px';
			// adjustpn(ele.height);
			doane(e);
		};
		if(!menu && !pn) {
			menu = document.createElement('div');
			menu.id = menuid;
			if(cover) {
				menu.innerHTML = '<div class="zoominner" id="' + menuid + '_zoomlayer" style="display:none"><p><span class="y"><a id="' + menuid + '_imglink" class="imglink" target="_blank" title="'+ lang.open_innew+'"></a><a id="' + menuid + '_adjust" href="javascipt:;" class="imgadjust" title="'+ lang.zoom_100 +'"></a>' +
					'<a href="javascript:;" onclick="hideMenu()" class="imgclose" title="'+ lang.close +'"></a></span>'+ lang.zoom_by_mousewheel +'</p>' +
					'<div class="miku_zimg_tools" id="' + menuid + '_picpage"></div><div class="hm" id="' + menuid + '_img"></div></div>';
			} else {
				menu.innerHTML = '<div class="popupmenu_popup" id="' + menuid + '_zoomlayer" style="width:auto"><span class="right y"><a href="javascript:;" onclick="hideMenu()" class="flbc" style="width:20px;margin:0 0 2px 0">'+lang.close+'</a></span>'+ lang.zoom_by_mousewheel+'<div class="zimg_p" id="' + menuid + '_picpage"></div><div class="hm" id="' + menuid + '_img"></div></div>';
			}
			if(BROWSER.ie || BROWSER.chrome){
				menu.onmousewheel = adjust;
			} else {
				menu.addEventListener('DOMMouseScroll', adjust, false);
			}
			$('append_parent').appendChild(menu);
			if($(menuid + '_adjust')) {
				$(menuid + '_adjust').onclick = function(e) {adjust(e, 1)};
			}
		}
		showloading(zimg, pn);
		picpage = '';
		$(menuid + '_picpage').innerHTML = '';
		picpage += ' <span class="miku_zimg_btn" title="' + lang.prev_page +'" onclick="miku_img_album_'+ cfg.pid +'()"><i class="miku_imgalbumfont">&#xe618;</i>'+ lang.prev_page +'</span> ';
		picpage += ' <span class="miku_zimg_num"><span>' + (zoom_index + 1) + '</span> / ' + cfg.img_total + '</span> ';
		picpage += ' <span class="miku_zimg_btn" title="' + lang.next_page +'" onclick="miku_img_album_'+ cfg.pid +'(1)">'+ lang.next_page +'<i class="miku_imgalbumfont">&#xe617;</i></span> ';
	
		$(menuid + '_picpage').innerHTML = picpage;
			
		showMenu({'ctrlid':obj.id,'menuid':menuid, 'duration':3,'pos':'00','cover':cover,'drag':menuid, 'maxh':''});
	}


	return function zoom_page(is_next) {
		if (is_next) {
			zoom_index = zoom_next_index;
			miku_zoom(g_big_img_tag, miku_img_info[zoom_next_index]['origPath'], 0, 1, 0, 1);
		} else {
			zoom_index = zoom_prev_index;
			miku_zoom(g_big_img_tag, miku_img_info[zoom_prev_index]['origPath'], 0, 1, 0, 1);
		}
	}


}

