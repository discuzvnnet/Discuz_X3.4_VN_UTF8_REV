<?php
if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}
class plugin_img_album {
	//去掉调用帖子摘要中的标签
	public function discuzcode() {
		global $post;
		global $_G;
		$config = $_G['cache']['plugin']['img_album'];
		$config['allow_fids'] = unserialize($config['allow_fids']);
		$config['allow_gids'] = unserialize($config['allow_gids']);
		$msg = $_G['discuzcodemessage'];
		if($this->check($post, $config)){
			$zz_img = '/(\[img[\w\W]*?\]([\w\W]*?)\[\/img\])/i';
			$zz_attach = '/(\[attach\]([\w\W]*?)\[\/attach\])/i';
			$msg= preg_replace($zz_img, '<miku_img_album_tag>\1</miku_img_album_tag>', $msg);
			$_G['discuzcodemessage'] = preg_replace($zz_attach, '<miku_img_album_tag aid="\2">\1</miku_img_album_tag>', $msg);
		}else{
			$zz_tag='/\[\/?TUCE\]/i';
			$msg = preg_replace($zz_tag,'', $msg);
			$_G['discuzcodemessage'] = $msg;
		}
	}
	
	public function check($post, $config){
		global $_G;
		if($config['switch'] == 3){
			return false;
		}
		// 1、只在论坛中才解析
		if($_GET['mod'] !='viewthread'||$_GET['from']=='preview'||$_GET['action']=='printable'){
			return false;
		}
		// 2、是否在允许的用户组和板块
		if(!in_array($post['fid'], $config['allow_fids']) || !in_array($post['groupid'], $config['allow_gids'])){
			return false;
		}
		// 3、游客访问 且 游客看小图模式下 返回
		if(!$_G['uid'] && $_G["setting"]["guestviewthumb"]["flag"] == 1){
			return false;
		}

		// 4、是否只解析楼主贴
		if(!$post['first'] && $config['parse_floor']==1 ){
			return false;
		}
		return true;
	}
}

class plugin_img_album_forum extends plugin_img_album {

	public function post_editorctrl_left() {
		global $_G;
		$config=$_G['cache']['plugin']['img_album'];
		$allow_fids = unserialize($config['allow_fids']);
		$allow_gids =  unserialize($config['allow_gids']);
		$fid=dintval($_GET['fid']);
		$gid=$_G['groupid'];
		if(!in_array($fid, $allow_fids) || !in_array($gid, $allow_gids)){
			return;
		}
		//回帖状态时返回
		if(isset($_GET['action']) && strcasecmp( $_GET['action'],'reply')===0){
			return;
		}
		include template('img_album:editorctrl_view');
		return $btn_str;
	}

	public function viewthread_img_album_output(){
		global $_G, $postlist, $thread;
		$config = $_G['cache']['plugin']['img_album'];
		$subject = $thread['subjiect'];
		//列表中小图的大小和间隔
		$s_size = explode(',', $config['s_size']); //小图的宽,高,上下间距，左右间距
		$config['s_width'] = isset($s_size[0]) && dintval($s_size[0]) >= 0 ? dintval($s_size[0]) : 98;
		$config['s_height'] = isset($s_size[1]) && dintval($s_size[1]) >= 0 ? dintval($s_size[1]) :  70;
		$config['s_margin_vertical'] = isset($s_size[2]) && dintval($s_size[2]) >= 0 ?dintval($s_size[2]) : 5;
		$config['s_margin'] = isset($s_size[3]) && dintval($s_size[3]) >= 0 ? dintval($s_size[3]) : 3;
		//两个按钮的宽度
		$config['s_btn_width'] =  dintval($config['s_btn_width']) >= 0 ? dintval($config['s_btn_width']) : 15 ;


		require_once DISCUZ_ROOT."source/plugin/img_album/img_album_core.class.php";
		$core = new img_album_core($config);
		
		foreach ($postlist as $pid => $post) {

			if(!$post['first'] && $config['parse_floor']==1){
				continue;
			}
			
			if($core->check($post) === true && $core->parse($post) === true){
				$postlist[$pid]['message'] = $core->makeHTML($post, 'pc', $this->getTuceAttr($config));
			}else{
				$postlist[$pid]['message'] = $core->deleteTuceTag($post['message']);
			}
		}
		
	}

	public function getTuceAttr($config){
		global $_G;
		$sizeinfo=array();
		//列表中小图的大小和间隔:
		$s_width = $config['s_width'];
		$s_height = $config['s_height'];
		$s_margin = $config['s_margin'];
		$s_margin_vertical =$config['s_margin_vertical'];
		//两个按钮的宽度
		$s_btn_width =  $config['s_btn_width']*2;

		// 格子数
		$width_size = dintval($config['width_size']); //5;
		$height_px = dintval($config['height_px']);
		$min_height = dintval($config['min_height']);
		if($width_size < 3 || $width_size > 9){
			$width_size = 5;
		}
		if($height_px < 300 || $height_px > 1000 ){
			$height_px = 500;
		}
		if($min_height > ($height_px-$s_height) || $min_height < 200 || $min_height > 500){
			$min_height = 300;
		}
		//整个图册的宽高
		$sizeinfo['width'] = ($s_margin*2 + $s_width)*$width_size+$s_btn_width;
		$sizeinfo['height_px'] = $height_px;
		//小图的宽高和间隔
		$sizeinfo['s_margin'] = $s_margin;
		$sizeinfo['s_margin_vertical'] = $s_margin_vertical;
		$sizeinfo['s_width'] = $s_width;
		$sizeinfo['s_height'] = $s_height;
		$sizeinfo['s_btn_width'] = $s_btn_width;
		$sizeinfo['s_size'] = $width_size;
		//颜色
		$sizeinfo['s_active_color'] = $config['s_active_color'];
		$sizeinfo['s_bgcolor'] = $config['s_bgcolor'];
		$sizeinfo['s_btn_color'] = $config['s_btn_color'];
		$sizeinfo['s_btn_bgcolor'] = $config['s_btn_bgcolor'];
		//大图的高度（最大高度）
		$sizeinfo['b_height'] = $height_px -$s_height;
		//大图最小高度
		$sizeinfo['min_height'] = $min_height;
		return $sizeinfo;
	}
}




class mobileplugin_img_album extends plugin_img_album {
	//去掉调用帖子摘要中的标签
	public function discuzcode() {
		global $post;
		global $_G;

		$config = $_G['cache']['plugin']['img_album'];
		$config['allow_fids'] = unserialize($config['allow_fids']);
		$config['allow_gids'] = unserialize($config['allow_gids']);
		$msg = $_G['discuzcodemessage'];
		if($this->check($post, $config)){
			$zz_img = '/(\[img[\w\W]*?\]([\w\W]*?)\[\/img\])/i';
			$zz_attach = '/(\[attach\]([\w\W]*?)\[\/attach\])/i';
			$msg= preg_replace($zz_img, '<miku_img_album_tag>\1</miku_img_album_tag>', $msg);
			$_G['discuzcodemessage'] = preg_replace($zz_attach, '<miku_img_album_tag aid="\2">\1</miku_img_album_tag>', $msg);
		}else{
			$zz_tag='/\[\/?TUCE\]/i';
			$msg = preg_replace($zz_tag,'', $msg);
			$_G['discuzcodemessage'] = $msg;
		}
	}

	public function check($post, $config){
		global $_G;
		if($config['switch'] == 2){
			return false;
		}

		// 1、只在论坛中才解析
		if($_GET['mod'] !='viewthread'||$_GET['from']=='preview'||$_GET['action']=='printable' || $_GET['mobile']==1){
			return false;
		}
		// 2、是否在允许的用户组和板块
		if(!in_array($post['fid'], $config['allow_fids']) || !in_array($post['groupid'], $config['allow_gids'])){
			return false;
		}
		// 3、游客访问 且 游客看小图模式下 返回
		if(!$_G['uid'] && $_G["setting"]["guestviewthumb"]["flag"] == 1){
			return false;
		}
		// 4、是否只解析楼主贴
		if(!$post['first'] && $config['parse_floor']==1){
			return false;
		}
		return true;
	}
}


class mobileplugin_img_album_forum extends mobileplugin_img_album {

	function viewthread_img_album_output(){
		global $_G, $postlist, $thread;
		$config = $_G['cache']['plugin']['img_album'];
		$subject = $thread['subject'];

		require_once DISCUZ_ROOT."source/plugin/img_album/img_album_core.class.php";
		$core = new img_album_core($config, true);
		foreach ($postlist as $pid => $post) {

			if(!$post['first'] & $config['parse_floor']==1){
				continue;
			}
			if($core->check($post) === true && $core->parse($post) === true){
				$postlist[$pid]['message'] = $core->makeHTML($post, 'touch', $this->getTuceAttr($config));
			}else{
				$postlist[$pid]['message'] = $core->deleteTuceTag($post['message']);
			}
		}
	}

	function getTuceAttr($config){
		//手机端幻灯片的高度设置百分比：95===95%
		$attr = array();
		$attr['height'] = $config['mobile_height'];
		if($attr['height'] < 80 || $attr['height'] > 120){
			$attr['height'] = 100;
		}
		// 幻灯片的最小高度
		$attr['min_height'] = $config['mobile_min_height'];
		if($attr['min_height'] < 200 || $attr['min_height'] > 350){
			$attr['min_height'] = 250;
		}

		return $attr;
	}

}