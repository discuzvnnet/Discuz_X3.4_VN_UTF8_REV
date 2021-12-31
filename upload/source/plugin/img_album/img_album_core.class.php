<?php
if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}


class img_album_core
{
	public $_minPicNum = 3;
	public $_pid = 0;
	public $haveTuceTag = false;
	public $isMobile = false;
	public $cfg = array();
	public $nativeData = array();
	public $_imgArr = array();
	public $tipsInfo = array();

	public function __construct($config, $isMobile = false){
		$this->cfg = $config;
		$this->_minPicNum = dintval($config['img_num']) > 0 ? dintval($config['img_num']): $this->_minPicNum;
		$this->cfg['allow_fids'] = unserialize($config['allow_fids']);
		$this->cfg['allow_gids'] = unserialize($config['allow_gids']);
		$this->isMobile =  $isMobile;
		$this->getNativePostData();	
	}

	public function init(){
		$this->haveTuceTag = false;
		$this->_imgArr = array();
		$this->tipsInfo = array();
	}

	public function check($post){
		global $_G;

		if(($this->isMobile==true && $this->cfg['switch'] == 2) || ($this->isMobile==false && $this->cfg['switch'] == 3) ){
			return false;
		}
		// 1、只在论坛中才解析
		if($_GET['mod'] !='viewthread'||$_GET['from']=='preview'||$_GET['action']=='printable'){
			return false;
		}
		// 2、是否在允许的用户组和板块
		$msg=$post['message'];
		$fid=$post['fid'];
		$gid=$post['groupid'];

		if(!in_array($fid, $this->cfg['allow_fids']) || !in_array($gid, $this->cfg['allow_gids'])){
			return false;
		}
		// 3、游客访问 且 游客看小图模式下 返回
		if(!$_G['uid'] && $_G["setting"]["guestviewthumb"]["flag"] == 1){
			return false;
		}
		return true;
	}

	public function parse($post){
		$this->init();
		$this->_pid=$post['pid'];
		$msg = $post['message'];
		// 找出[TUCE][/TUCE]标签的区域
		$zz_tuce='/\[TUCE\][\w\W]*\[\/TUCE\]/i';
		$matches=array();
		preg_match($zz_tuce,  $msg, $matches);
		if(!empty($matches)) {
			$this->haveTuceTag = true;
			// 1、如果找到了TUCE标签，就不管是什么“解析模式”了，就都只解析TUCE标签中的内容
			$tuce_area=trim($matches[0]);
			if( $this->getImgTagNum($tuce_area) == 0 ){
				$zz_tag='/\[\/?TUCE\]/i';
				$postlist[$pid]['message']=preg_replace($zz_tag,'', $msg);
				return false;
			}
			return $this->parseMode_TUCE($post);
		}elseif(empty($matches) && $this->cfg['parse_mode'] == 1){
			// 2、如果找不到tuce标签 且 解析模式是“直解析TUCE标签模式”
			// 在这里需要删除<miku_img_album_tag>标签、TUCE标签。
			return false;
		}elseif(empty($matches) && $this->cfg['parse_mode']== 2){
			// 3、如果找不到TUCE标签，且解析模式为“自动解析”的话，就需要判断图片的数量了是否>=3张了。
			return $this->parseMode_Auto($post);
		}
	}

	//拼接帖子内容+幻灯片HTML代码
	public function makeHTML($post, $type, $tuceAttr){
		if($type == 'pc'){
			//要分成2步处理，1、有TUCE标签；2、无图册标签。
			$pid = $this->_pid;
			$imgList = $this->_imgArr;
			$total = count($imgList);
			$config = $this->cfg;
			$notTipStr = $this->tipsInfo['not_tip_str'];
			$tipsList = $this->tipsInfo['tips_arr'];
			$img_info_json = $this->arr2json($imgList);
			$tips_arr_json = $this->cfg['img_tips_mode'] <=2 ? $this->arr2json($tipsList) : "null";
			include template('img_album:img_album_view');
			$content = '';
			if($this->haveTuceTag){
				$content = preg_replace("/\[TUCE\][\w\W]*\[\/TUCE\]/i", $img_album_str.$notTipStr, $post['message']);
				$content = $this->deleteTuceTag($content);
			}else{
				$content = $img_album_str.$this->clearImgTags($post['message']);
			}
			return $content;
		}elseif($type == 'touch'){
			//要分成2步处理，1、有TUCE标签；2、无图册标签。
			$pid = $this->_pid;
			$imgArr = $this->_imgArr;
			$imgNum = count($imgArr);
			$config = $this->cfg;
			$notTipStr = $this->tipsInfo['not_tip_str'];
			$tipsArr = $this->tipsInfo['tips_arr'];
			include template('img_album:show');
			$content = '';
			if($this->haveTuceTag){
				$content = preg_replace("/\[TUCE\][\w\W]*\[\/TUCE\]/i", $tuceHTML.$notTipStr, $post['message']);
				$content = $this->deleteTuceTag($content);
			}else{
				$content = $tuceHTML.$this->clearImgTags($post['message']);
			}
			return $content;
		}
	}



	public function getImages($msg){
		$zz = '/(\[img[\w\W]*?\]([\w\W]*?)\[\/img\])|(\[attach\]([\w\W]*?)\[\/attach\])/i';
		// $zz_img = '/\[img[\w\W]*?\]([\w\W]*?)\[\/img\]/i';
		// $zz_attach = '/\[attach\]([\w\W]*?)\[\/attach\]/i';
		if (version_compare(PHP_VERSION, '5.3.0', '>=')) {
			$v = preg_replace_callback($zz, "self::_imgTagReplace", $msg);
			// $v = preg_replace_callback($zz_img, "self::_imgReplace", $msg);
 			// $v = preg_replace_callback($zz_attach, "self::_attachReplace", $v);
		}else{
			$v = preg_replace_callback($zz, array($this, '_imgTagReplace'), $msg);
			// $v = preg_replace_callback($zz_img, array($this, '_imgReplace'), $msg);
			// $v = preg_replace_callback($zz_attach, array($this, '_attachReplace'), $v);
		}
	}
	//获取图册标签中的图片列表
	public function getImagesByTuce($pid){
		$msg = $this->nativeData[$pid]['message'];
		$zz_tuce = '/\[TUCE\][\w\W]*\[\/TUCE\]/i';
		preg_match($zz_tuce,  $msg, $matches);
		$tuce_area = $matches[0];
		$this->getImages($tuce_area);
	}

	//获取帖子内容选中的图片列表
	public function getImagesByMessage($pid){
		$msg = $this->nativeData[$pid]['message'];;
		$this->getImages($msg);
	}

	//获取未放入帖子内容中的图片列表
	public function getImagesByImagelist($pid){
		global $postlist;
		$attach = $postlist[$pid]['attachments'];
		foreach ($postlist[$pid]['imagelist'] as $key => $aid) {
			if($attach[$aid]){
				$thumbPath = $this->isMobile ? getforumimg($aid, 0, '800', '800', 'fixnone') : getforumimg($aid, 0, $this->cfg['s_width'], $this->cfg['s_height'], 'fixwr');
				$this->_imgArr[] = array(
					'thumbPath' => $thumbPath,
					'is_attachimg' => 1,
					'origPath' => $attach[$aid]['url']. $attach[$aid]['attachment'],
					'alt' => $attach[$aid]['imgalt']
				);
			}
		}
	}


	// 获取未解析的帖子数据
	public function getNativePostData($pids = null){
		global $thread;
		global $postlist;
		if($pids === null){
			$pids = array_keys($postlist);
		}
		$this->posttableid = $thread['posttableid'];//当前帖子的数据表ID
		$this->nativeData = C::t('forum_post')->fetch_all_by_pid($this->posttableid, $pids);
		// 可以同时获取当前主题的多个帖子，传入一个pid数组，可获取多个帖子的数据。
		// $native_data = C::t('forum_post')->fetch_all_by_pid($posttableid, array(337,345));
		// $native_msg = $native_data[$pid]['message'];
		return $this->nativeData;
	}

	//获取帖子中的图片标签的数量
	public function getImgTagNum($content){
		$zz_img='/<img.*?>/i';
		preg_match_all($zz_img,  $content, $matches);
		$img_arr = $matches[0];
		return count($img_arr);
	}




	//获取图片注释
	public function getTips($post){
		$msg = $post['message'];
		$tips_mode = $this->cfg['img_tips_mode'];
		$full_space = lang('plugin/img_album', 'full_space');//全角空格
		$place_holder = '<miku-img-place-holder/>';
		$zz_place_holder = '/<miku-img-place-holder\/>/isU';
		
		// 1、找出[TUCE][/TUCE]标签的区域
		$zz_tuce='/\[TUCE\][\w\W]*\[\/TUCE\]/i';
		$matches=array();
		preg_match($zz_tuce,  $msg, $matches);
		$tuce_area = preg_replace('/[\r\n]/is', '', trim($matches[0]));
		$zz_miku_img = '/<miku_img_album_tag>.*<\/miku_img_album_tag>/isU';
		$zz_miku_attach = '/<miku_img_album_tag aid="(\d*)">(.*)<\/miku_img_album_tag>/isU';

		$tuce_area = preg_replace($zz_miku_img, $place_holder, $tuce_area);

		if (version_compare(PHP_VERSION, '5.3.0', '>=')) {
			$tuce_area = preg_replace_callback($zz_miku_attach, "self::_mikuTagReplace", $tuce_area);
		}else{
			$tuce_area = preg_replace_callback($zz_miku_attach, array($this, '_mikuTagReplace'), $tuce_area);
		}

		//tips_mode==4 表示不显示注释，把图册内的文本显示在图册外部显示。
		if($this->cfg['img_tips_mode'] == 4){
			//把[TUCE][/TUCE]标签中不是img、br标签的内容取出来
			$tmp = preg_replace($zz_place_holder, '', $tuce_area);

			$tipsInfo["not_tip_str"] = preg_replace('/(\s*<br\s*\/?>\s*)+/is', '<br/>', $tmp);
			$tipsInfo["tips_arr"] = null;
			return $tipsInfo;
		}


		//在[TUCE][/TUCE]标签范围内的，每张图片下面的文字作为注释，注释的结束位置是下一张图片开始
		//分割图册区域的字符串
		$tips_arr=preg_split($zz_place_holder, $tuce_area);
		$zz_tag = '/<.*?>/i';
		$not_tip_str="";
		//移除数组第一个元素，因为第一个元素是第一张图片前的文字，不作为注释用。
		$not_tip_str=array_shift($tips_arr);
		for ($i=0; $i < count($tips_arr); $i++) {
			//收集图册区域的非文本注释内容
			preg_match_all($zz_tag, $tips_arr[$i], $matchs);
			$not_tip_str .= implode('',$matchs[0]);

			//提取出来的 干净的注释内容（去除html标签、空格实体、全角空格）
			$zz_tmp='/\[\/?TUCE\]|(<.*?>)|(&nbsp;)|([\r\n])|'.$full_space.'/i';
			$tips_arr[$i] = trim(preg_replace($zz_tmp, '', $tips_arr[$i]));
		}
		
		if($this->cfg['img_tips_mode'] == 1){ //等于1表示注释只在图册内部显示
			$tipsInfo["not_tip_str"] = $not_tip_str;
			$tipsInfo["tips_arr"] = $tips_arr;
		}else if($this->cfg['img_tips_mode'] == 2){ //注释在图册内显示的同时， 也在图册外面显示。
			$tuce_area = preg_replace($zz_place_holder, '<br/>', $tuce_area);
			$tipsInfo["not_tip_str"] = $tuce_area;
			$tipsInfo["tips_arr"] = $tips_arr;
		}else if($this->cfg['img_tips_mode'] == 3){ //注释 既不在图册内显示，也不在图册外显示。
			$tipsInfo["not_tip_str"] = $not_tip_str;
			$tipsInfo["tips_arr"] = null;
		}
		// 合并多个br
		$tipsInfo["not_tip_str"] = preg_replace('/(\s*<br\s*\/?>\s*)+/is', '<br/>', $tipsInfo["not_tip_str"]);
		$tipsInfo["not_tip_str"] = preg_replace('/(>\s*<br\s*\/?>\s*<)+/is', '><',$tipsInfo["not_tip_str"] );
		return $tipsInfo;
	}


	//解析[TUCE]标签内的
	public function parseMode_TUCE($post){
		$this->getImagesByTuce($post['pid']);
		if(count($this->_imgArr) < $this->_minPicNum){
			return false;
		}else{
			$this->tipsInfo = $this->getTips($post);
			return true;
		}
	}

	//自动解析模式（发现成对的[TUCE]标签就解析标签内的，没有发现图册标签就解析整个帖子里的图片，图片数量必须大于2才解析）
	public function parseMode_Auto($post){
		$this->getImagesByMessage($post['pid']);
		$this->getImagesByImagelist($post['pid']);
		if(count($this->_imgArr) < $this->_minPicNum){
			return false;
		}else{
			// $this->clearImgTags($post['message']);
			$this->tipsInfo = null;
			return true;
		}
	}

	//自动解析后调用，用于删除帖子中的：图片标记 + 原图片标签 + 帖外图片附件
	public function clearImgTags($msg){	
		global $postlist;
		$postlist[$this->_pid]['imagelist'] = array();
		$zz_miku_img = '/<miku_img_album_tag>(.*)?<\/miku_img_album_tag>/isU';
		$zz_miku_attach = '/<miku_img_album_tag aid="(\d*)">(.*)<\/miku_img_album_tag>/isU';
		$zz_place_holder = '/<miku-img-place-holder\/>/isU';
		$place_holder = '<miku-img-place-holder/>';
		$msg = preg_replace($zz_miku_img, $place_holder, $msg);
		if (version_compare(PHP_VERSION, '5.3.0', '>=')) {
			$msg = preg_replace_callback($zz_miku_attach, "self::_mikuTagReplace", $msg);
		}else{
			$msg = preg_replace_callback($zz_miku_attach, array($this, '_mikuTagReplace'), $msg);
		}

		return preg_replace($zz_place_holder, '', $msg);
	}

	public function deleteTuceTag($content){
		$zz_tag='/(\[\/?TUCE\])|(<\/?miku_img_album_tag>)|(<miku_img_album_tag aid="\d*">)/isU';
		return preg_replace($zz_tag, '', $content);
	}

	private function _mikuTagReplace($m){
		global $postlist;
		$aid = $m[1];
		$attach = $postlist[$this->_pid]['attachments'][$aid];
		if( $attach && $attach['isimage']){
			return '<miku-img-place-holder/>';
		}else{
			return $m[2];
		}
	}

	private function _imgTagReplace($m){
		global $postlist;

		if(strtolower(substr($m[0], 0, 8)) == '[attach]'){
			$aid = $m[4];
			$attach = $postlist[$this->_pid]['attachments'][$aid];
			if( $attach && $attach['isimage']){
				$thumbPath = $this->isMobile ? getforumimg($aid, 0, '800', '800', 'fixnone') : getforumimg($aid, 0, $this->cfg['s_width'], $this->cfg['s_height'], 'fixwr');
				$this->_imgArr[] = array(
					'thumbPath' => $thumbPath,
					'origPath' => $attach['url'].$attach['attachment'],
					'is_attachimg' => 1,
					'alt' => $attach['imgalt']
				);
				return '<img src="'.$thumbPath.'" />';
			}else{
				return '';
			}

		}else{
			$url = $m[2];
			if(!in_array(strtolower(substr($url, 0, 6)), array('http:/', 'https:', 'ftp://', 'rtsp:/', 'mms://'))) {
				$url = 'http://'.$url;
			}
			$url = addslashes($url);
			$this->_imgArr[] = array(
				'thumbPath' => $url,
				'origPath' => $url,
				'is_attachimg' => 0,
				'alt' => null
			);

			return "<img src=\"$url\" >";
		}
	}


	

	private function arr2json($arr){
		if(!is_array($arr)){
			return "null";
		}
		$json="{";
		$tmp_arr=array();
		foreach ($arr as $key => $value) {
			if(is_array($value)){
				$tmp_arr[]="\"$key\":".$this->arr2json($value);
			}else{
				$tmp_arr[]="\"$key\":\"".$value."\"";
			}
		}

		$json.=implode(',', $tmp_arr)."}";
		return $json;

	}
}