<?php

/**
 *      [Discuz!] (C)2001-2099 Comsenz Inc.
 *      This is NOT a freeware, use is subject to license terms
 *
 *      $Id: install_lang.php 36287 2016-12-12 03:59:05Z nemohou $
 */

if(!defined('IN_COMSENZ')) {
	exit('Access Denied');
}

define('UC_VERNAME', 'Tiếng Việt');
$lang = array(
	'SC_GBK' => '简体中文版',
	'TC_BIG5' => '繁体中文版',
	'SC_UTF8' => '简体中文 UTF8 版',
	'TC_UTF8' => '繁体中文 UTF8 版',
	'EN_ISO' => 'ENGLISH ISO8859',
	'EN_UTF8' => 'ENGLIST UTF-8',

	'title_install' => 'Cài đặt '.SOFT_NAME.'',
	'agreement_yes' => 'Đồng ý',
	'agreement_no' => 'Hủy bỏ',
	'notset' => 'Không giới hạn',
	'enable' => 'Mở',
	'disable' => 'Đóng',

	'message_title' => 'Thông báo',
	'error_message' => 'Có lỗi',
	'message_return' => 'Quay lại',
	'return' => 'Quay lại',
	'install_wizard' => 'Cài đặt Discuz X3.4',
	'config_nonexistence' => 'Tập tin cấu hình không tồn tại',
	'nodir' => 'Thư mục không tồn tại',
	'redirect' => 'Trình duyệt sẽ tự động chuyển sang trang mới.<br>Nếu không hỗ trợ hãy bấm vào đây.',
	'auto_redirect' => 'Trình duyệt sẽ tự động chuyển sang trang mới',
	'database_errno_2003' => 'Không thể kết nối với CSDL vui lòng kiểm tra địa chỉ máy chủ CSDL',
	'database_errno_1044' => 'Không thể tạo CSDL mới, hãy kiểm tra tên CSDL là chính xác',
	'database_errno_1045' => 'Không thể kết nối với CSDL vui lòng kiểm tra tài khoản hoặc mật khẩu CSDL',
	'database_errno_1064' => 'Lỗi kết nối CSDL',

	'dbpriv_createtable' => 'Không thể CREATE TABLE để tiếp tục cài đặt',
	'dbpriv_insert' => 'Không thể INSERT để tiếp tục cài đặt',
	'dbpriv_select' => 'Không thể SELECT để tiếp tục cài đặt',
	'dbpriv_update' => 'Không thể UPDATE để tiếp tục cài đặt',
	'dbpriv_delete' => 'Không thể DELETE để tiếp tục cài đặt',
	'dbpriv_droptable' => 'Không thể DROP TABLE để tiếp tục cài đặt',

	'db_not_null' => 'CSDL đã được cài đặt Ucenter, tiếp tục cài đặt sẽ xóa dữ liệu gốc.',
	'db_drop_table_confirm' => 'Tiếp tục cài đặt CSDL cũ sẽ bị xóa hết. Bạn có chắc chắn muốn tiếp tục ?',

	'writeable' => 'Có thể viết',
	'unwriteable' => 'Không thể viết',
	'old_step' => 'Quay lại',
	'new_step' => 'Tiếp theo',

	'database_errno_2003' => 'Không thể kết nối với cơ sở dữ liệu. Vui lòng kiểm tra cơ sở dữ liệu được kết nối với máy chủ cơ sở dữ liệu chính xác hay không.',
	'database_errno_1044' => 'Không thể tạo cơ sở dữ liệu mới, vui lòng kiểm tra tên chính xác của cơ sở dữ liệu',
	'database_errno_1045' => 'Không thể kết nối với cơ sở dữ liệu, vui lòng xác minh tên người dùng và mật khẩu cơ sở dữ liệu là chính xác.',
	'database_connect_error' => 'Lỗi kết nối cơ sở dữ liệu',

	'step_title_1' => 'Môi trường',
	'step_title_2' => 'Ucenter',
	'step_title_3' => 'CSDL',
	'step_title_4' => 'Cài đặt',
	'step_env_check_title' => 'Bắt đầu cài đặt',
	'step_env_check_desc' => 'Kiểm tra môi trường cài đặt',
	'step_db_init_title' => 'Cài đặt cơ sở dữ liệu',
	'step_db_init_desc' => 'Đang chạy trình cài đặt cơ sở dữ liệu',

	'step1_file' => 'Tập tin',
	'step1_need_status' => 'Yêu cầu',
	'step1_status' => 'Hiện tại',
	'not_continue' => 'Xin vui lòng sửa đổi theo yêu cầu',

	'tips_dbinfo' => 'Điền thông tin CSDL',
	'tips_dbinfo_comment' => '',
	'tips_admininfo' => 'Điền thông tin quản trị',
	'step_ext_info_title' => 'Cài đặt thành công',
	'step_ext_info_comment' => 'Nhấn vào đây để nhập thông tin đăng nhập',

	'ext_info_succ' => 'Cài đặt thành công',
	'install_submit' => 'Tiếp tục',
	'install_locked' => 'Cài đặt bị tạm dừng, nếu bạn muốn cài đặt lại, hãy vào máy chủ và xóa<br /> '.str_replace(ROOT_PATH, '', $lockfile),
	'error_quit_msg' => 'Bạn phải khắc phục sự cố trên, nếu không quá trình cài đặt sẽ không được tiến hành.',

	'step_app_reg_title' => 'Thiết lập môi trường',
	'step_app_reg_desc' => 'Kiểm tra máy chủ và Ucenter',
	'tips_ucenter' => 'Điền thông tin Ucenter',
	'tips_ucenter_comment' => 'Nếu bạn đã cài đặt Ucenter thì hãy điền vào các thông tin dưới đây, nếu chưa cài đặt bạn có thể tải Ucenter tại <a href="http://www.discuz.com/" target="blank">Comsenz</a>',

	'advice_mysql_connect' => 'Kiểm tra chắc chắn các module mysql không bị lỗi',
	'advice_gethostbyname' => 'Để cài đặt cần mở chức năng gethostbyname',
	'advice_file_get_contents' => 'Sửa trong php.ini hàm allow_url_fopen sang On để có thể cài đặt',
	'advice_xml_parser_create' => 'Chức năng này yêu cầu có hỗ trợ XML trong PHP',
	'advice_fsockopen' => 'Sửa trong php.ini hàm allow_url_fopen sang On để có thể cài đặt',
	'advice_pfsockopen' => 'Cần bật hàm allow_url_fopen',
	'advice_stream_socket_client' => 'Cần bật hàm stream_socket_client',
	'advice_curl_init' => 'Cần bật hàm curl_init',

	'ucurl' => 'URL UCenter',
	'ucpw' => 'Mật khẩu',
	'ucip' => 'IP UCenter',
	'ucenter_ucip_invalid' => 'Định dạng lỗi, vui lòng điền đúng định dạng IP',
	'ucip_comment' => 'Thường thì không phải điền',

	'tips_siteinfo' => 'Xin vui lòng điền vào các thông tin trang web',
	'sitename' => 'Tên trang web',
	'siteurl' => 'URL trang web',

	'forceinstall' => 'Bắt buộc cài đặt',
	'dbinfo_forceinstall_invalid' => 'CSDL này đã chứa dữ liệu, để cài đặt bạn có thể sửa các bảng tiền tố hoặc cài đè nên dữ liệu cũ.',

	'click_to_back' => 'Quay lại',
	'adminemail' => 'Admin Email',
	'adminemail_comment' => 'Dùng để báo lỗi chương trình',
	'dbhost_comment' => 'Thường là localhost',
	'dbname_comment' => 'Cơ sở dữ liệu dùng để cài đặt Discuz!',
	'dbuser_comment' => 'Tên người dùng cơ sở dữ liệu của bạn',
	'dbpw_comment' => 'Mật khẩu cơ sở dữ liệu của bạn',
	'tablepre_comment' => 'Điền vào nếu mún phân biệt bảng khi cài nhiều diễn đàn',
	'forceinstall_check_label' => 'Tôi sẽ cài đè dữ liệu cũ',

	'uc_url_empty' => 'Bạn chưa điền URL Ucenter.',
	'uc_url_invalid' => 'URL không hợp lệ',
	'uc_url_unreachable' => 'Sai URL Ucenter, vui lòng kiểm tra',
	'uc_ip_invalid' => 'Không thể dùng tên miền, vui lòng điền IP',
	'uc_admin_invalid' => 'Sai mật khẩu Ucenter',
	'uc_data_invalid' => 'Sai thông tin, vui lòng kiểm tra URL Ucenter ',
	'uc_dbcharset_incorrect' => 'Mã font Ucenter không trùng với Discuz X1.5, vui lòng kiểm tra',
	'uc_api_add_app_error' => 'Thêm ứng dụng vài Ucenter không thành công',
	'uc_dns_error' => 'DNS Ucenter lỗi vui lòng dùng IP',

	'ucenter_ucurl_invalid' => 'Sai URL Ucenter',
	'ucenter_ucpw_invalid' => 'Sai mật khẩu Ucenter',
	'siteinfo_siteurl_invalid' => 'URL trang web trống hoặc sai định dạng',
	'siteinfo_sitename_invalid' => 'Tên trang web trống, vui lòng kiểm tra',
	'dbinfo_dbhost_invalid' => 'Sai tên máy chủ CSDL',
	'dbinfo_dbname_invalid' => 'Sai tài khoản',
	'dbinfo_dbuser_invalid' => 'Sai tài khoản CSDL, vui lòng kiểm tra',
	'dbinfo_dbpw_invalid' => 'Sai mật khẩu CSDL, vui lòng kiểm tra',
	'dbinfo_adminemail_invalid' => 'Email trống, vui lòng kiểm tra',
	'dbinfo_tablepre_invalid' => 'Bảng tiền tố trống hoặc sai định dạng, vui lòng kiểm tra',
	'admininfo_username_invalid' => 'Tên tài khoản trống hoặc sai định dạng, vui lòng kiểm tra',
	'admininfo_email_invalid' => 'Email trống, vui lòng kiểm tra',
	'admininfo_password_invalid' => 'Mật khẩu trống, vui lòng kiểm tra',
	'admininfo_password2_invalid' => 'Hai mật khẩu không giống nhau.',

	'install_dzfull' => '<br><label><input type="radio"'.(getgpc('install_ucenter') != 'no' ? ' checked="checked"' : '').' name="install_ucenter" value="yes" onclick="if(this.checked)$(\'form_items_2\').style.display=\'none\';" /> Cài mới cùng UCenter</label>',
	'install_dzonly' => '<br><label><input type="radio"'.(getgpc('install_ucenter') == 'no' ? ' checked="checked"' : '').' name="install_ucenter" value="no" onclick="if(this.checked)$(\'form_items_2\').style.display=\'\';" /> Cài với Ucenter sẵn có</label>',

	'username' => 'Tài khoản',
	'email' => 'Email',
	'password' => 'Mật khẩu',
	'password_comment' => 'Điền vào mật khẩu',
	'password2' => 'Nhập lại',

	'admininfo_invalid' => 'Sai thông tin, vui lòng kiểm tra lại',
	'dbname_invalid' => 'Tên CSDL trống, vui lòng điền lại',
	'tablepre_invalid' => 'Sai tiền tố hoặc trống, vui lòng kiểm tra',
	'admin_username_invalid' => 'Tên tài khoản không đúng, tối đa là 15 ký tự và không có ký tự đặc biệt',
	'admin_password_invalid' => 'Hai mật khẩu không giống nhau',
	'admin_email_invalid' => 'Email lỗi, email đã được sử dụng hoặc sai định dạng.',
	'admin_invalid' => 'Thông tin lỗi, hãy nhập cẩn thận từng mục',
	'admin_exist_password_error' => 'Tên người sử dụng đã tồn tại, nếu bạn muốn thiết lập quản trị diễn đàn này, vui lòng nhập đúng mật khẩu cho người dùng, hoặc thay thế tên của người quản trị diễn đàn',

	'tagtemplates_subject' => 'Tiêu đề',
	'tagtemplates_uid' => 'Số ID',
	'tagtemplates_username' => 'Tài khoản',
	'tagtemplates_dateline' => 'Ngày',
	'tagtemplates_url' => 'Địa chỉ chủ đề',

	'uc_version_incorrect' => 'Phiên bản Ucenter đã quá cũ bạn cần cập nhật bản mới tại ：http://www.comsenz.com/ hoặc http://wwww.discuz.net',
	'config_unwriteable' => 'Không cài đặt, bạn cần chmod tập tin config.inc.php = 0777',

	'install_in_processed' => 'Cài đặt ...',
	'install_succeed' => 'Cài đặt thành công, bấm vào đây để tiếp tục',
	'install_cloud' => 'Chúc mừng bạn đã hoàn thành cài đặt. Chào mừng bạn tham gia phát triển Discuz! Cloud: Discuz! Dựa trên đám mây cho phép tất cả quản trị viên web cập nhật số lượng lưu lượng truy cập trang web của họ. Và tăng khả năng quản lý trang web của bạn để tăng thu nhập từ trang web của bạn. <br> Discuz! Cloud miễn phí truy cập như QQ Internet, Tencent, nhóm QQ, chuyển vùng, dịch vụ biểu hiện SOSO. Đám mây sẽ tiếp tục cung cấp dịch vụ chất lượng hơn nữa. <br> Trước khi kích hoạt Discuz! Cloud, hãy đảm bảo rằng trang web （Discuz !, UCHome hoặc SupeSite） của bạn đã được nâng cấp thành công lên Discuz! X3.',
	'to_install_cloud' => 'Cài đặt',
	'to_index' => 'Mở',

	'init_credits_karma' => 'Uy tín',
	'init_credits_money' => 'Tiền',

	'init_postno0' => 'Chủ thớt',
	'init_postno1' => 'Giật tem',
	'init_postno2' => 'Hạng 3',
	'init_postno3' => 'Hạng 4',

	'init_support' => 'Tốt',
	'init_opposition' => 'Kém',

	'init_group_0' => 'Thành viên',
	'init_group_1' => 'Quản trị viên',
	'init_group_2' => 'Siêu quản lý',
	'init_group_3' => 'Quản lý',
	'init_group_4' => 'Cấm phát ngôn',
	'init_group_5' => 'Cấm truy cập',
	'init_group_6' => 'Cấm IP',
	'init_group_7' => 'Khách',
	'init_group_8' => 'Chờ xác nhận',
	'init_group_9' => 'Khách/Chưa kích hoạt',
	'init_group_10' => 'Thành viên mới',
	'init_group_11' => 'Thành viên',
	'init_group_12' => 'Thành viên năng nổ',
	'init_group_13' => 'Thành viên nhiệt tình',
	'init_group_14' => 'Thành viên sáng giá',
	'init_group_15' => 'Thành viên gắn bó',

	'init_rank_1' => 'Tập viết',
	'init_rank_2' => 'Học sinh',
	'init_rank_3' => 'Sinh viên',
	'init_rank_4' => 'Tiến sĩ',
	'init_rank_5' => 'Giáo sư',

	'init_cron_1' => 'Xóa hết bài hôm nay',
	'init_cron_2' => 'Xóa thời gian online trong tháng',
	'init_cron_3' => 'Xóa hết dữ liệu ngày',
	'init_cron_4' => 'Thống kê email mừng sinh nhật',
	'init_cron_5' => 'Trả lời thông báo',
	'init_cron_6' => 'Xóa hết thông báo',
	'init_cron_7' => 'Xóa hết kế hoạch',
	'init_cron_8' => 'Làm sạch thúc đẩy diễn đàn',
	'init_cron_9' => 'Xóa hết chủ đề của tháng',
	'init_cron_10' => 'Cập nhật X-Space hàng ngày',
	'init_cron_11' => 'Chủ đề cập nhật hàng tuần',

	'init_bbcode_1' => 'Hiệu ứng này tương tự như thẻ marquee của HTML',
	'init_bbcode_2' => 'Nhúng hoạt hình Flash',
	'init_bbcode_3' => 'Hiển thị trạng thái trực tuyến QQ',
	'init_bbcode_4' => 'Bản thảo',
	'init_bbcode_5' => 'Đăng ký',
	'init_bbcode_6' => 'Nhúng Windows Media Audio',
	'init_bbcode_7' => 'Nhúng âm thanh hoặc video phương tiện Windows',

	'init_qihoo_searchboxtxt' =>'Nhập từ khóa, Tìm nhanh diễn đàn này',
	'init_threadsticky' =>'Chú ý, Phân loại, Chú ý',

	'init_default_style' => 'Phong cách mặc định',
	'init_default_forum' => 'Diễn đàn mặc định',
	'init_default_template' => 'Mẫu mặc định',
	'init_default_template_copyright' => 'Comsenz (Bắc Kinh)',

	'init_dataformat' => 'Y-n-j',
	'init_modreasons' => 'Quảng cáo/SPAM\r\nVirus\r\nKhông dấu\r\nLạc đề\r\nTrùng bài\r\n\r\nĐồng tình\r\nBài hay\r\nTinh hoa',
	'init_userreasons' => 'Quảng cáo\r\nSPAM\r\nSEX\r\nLạc đề\r\nPhạm quy\r\n\r\nĐồng tình\r\nBài hay\r\nNguyên tác',
	'init_link' => 'Discuz! Diễn đàn chính thức thiết lập và trao đổi kỹ thuật',
	'init_link_note' => 'Cung cấp Discuz mới nhất! Tin tức sản phẩm, tải về và trao đổi kỹ thuật',

	'init_promotion_task' => 'Nhiệm vụ thưởng',
	'init_gift_task' => 'Nhiệm vụ nhận quà',
	'init_avatar_task' => 'Nhiệm vụ avatar',

	'license' => '<div class="license"><h1>Vui lòng đọc quy định sử dụng mã nguồn Disuz!</h1>

<p>Copyright (c) 2001-2021, Tencent Cloud Computing (Beijing) Co., Ltd. (formerly Beijing Kangsheng Xinchuang Technology Co., Ltd.) All rights reserved.</p>

<p>Thank you for choosing Kangsheng products. We hope that our efforts can provide you with an efficient, fast, powerful site solution, and a powerful community forum solution. The website of Kangsheng Company is http://www.comsenz.com, and the official discussion website of the product is http://www.discuz.net.</p>

<p>Note to users: This agreement is a legal agreement between you and Kangsheng about your use of various software products and services provided by Kangsheng. Regardless of whether you are an individual or an organization, profitable or not, and for whatever purpose (including for the purpose of learning and research), you need to read this agreement carefully, including the exemption clauses that exempt or limit Kang Sheng\'s liability and restrictions on your rights. Please review and accept or not accept these Terms of Service. If you do not agree to these Terms of Service and/or any changes to them by Kang Sheng at any time, you should not use or actively cancel Kang Sheng products provided by Kang Sheng. Otherwise, any of your use of registration, login, download, and viewing of related services in Kangsheng products will be deemed to be your full acceptance of these Terms of Service, including any amendments made by Kangsheng to the Terms of Service at any time.
<p>Once these Terms of Service are changed, Kang Sheng will post the changes on the website. Once the revised terms of service are published on the website management background, they will effectively replace the original terms of service. You can check the latest version of the terms of service at the official forum of Kangsheng at any time. If you choose to accept these terms, you agree to be bound by the terms of the agreement. If you do not agree to these Terms of Service, you will not be granted the right to use the Service. If you violate the provisions of this clause, Kangsheng Company has the right to suspend or terminate your qualification to use Kangsheng products at any time and reserves the right to pursue relevant legal responsibilities.</p>
<p>After understanding, agreeing, and complying with all the terms of this agreement, you can start using Kangsheng products. You may enter into another written agreement directly with Kangsheng to supplement or replace all or any part of this agreement.</p></p>

<p>All intellectual property Kang Sheng has the software. This software is only for the license, not for sale. Kang Sheng only allows you to copy, in accordance with the terms of this agreement, download installation, use or otherwise benefit from the functions of the software or intellectual property rights.</p>

<h3>I. Licensed Rights</h3>
<ol>
   <li>You can fully comply with the end user license agreement, based on the software used in this non-commercial use, without having to pay for software copyright licensing fees.</li>
   <li>Agreement you can within the constraints and limitations modify Discuz! source code (if provided) or interface styles to suit your site requirements.</li>
   <li>You have to use this software to build the forum all the membership information, articles and related information of ownership, and is independent of commitment and legal obligations related to the article content.</li>
   <li>A commercial license, you can use this software for commercial applications, while according to the type of license purchased to determine the period of technical support, technical support, technical support form and content, from the moment of purchase, within the period of technical support have a way to get through the specified designated areas of technical support services. Business authorized users have the power to reflect and comment, relevant comments will be a primary consideration, but not necessarily be accepted promise or guarantee.</li>
   <li>You can download the application that suits your website from the application center service provided by Kangsheng, but you should pay the application developer / owner accordingly.</li>
</ol>

<h3>II. Constraints and restrictions stipulated in the agreement</h3>
<ol>
   <li>The software may not be used for commercial purposes (including, but not limited to, corporate websites, operational websites, profit-oriented websites, or profitable websites) without written commercial authorization from Kangsheng. For commercial license purchase, please visit http://www.discuz.com for reference, or call 8610-51282255 for details.</li>
   <li>May not associated with the software or business license for rental, sale, mortgage or grant sub-licenses.</li>
   <li>In any case, that no matter how used, whether modified or landscaping, changes to what extent, just use Discuz! the whole or any part, without the written permission of the Forum page footer Department Discuz! name and Sing Imagination (Beijing) Technology Co., Ltd. affiliated website (http://www.comsenz.com, http://www.discuz.com or http://www.discuz.net) the link must be retained, not removed or modified .</li>
   <li>Prohibited Discuz! the whole or any part of the basis for the development of any derivative version, modified version or third-party version for redistribution.</li>
   <li>The applications you download from the Application Center must not be reverse engineered, decompiled, decompiled, etc. without the written permission of the application developer/owner, Publishing, publishing, developing related derivative products, works, etc.</li>
   <li>If you fail to comply with the terms of this agreement, your authorization will be terminated, your licensed rights will be revoked, and you will be held legally responsible.
</ol>

<h3>III. Limited Warranty and Disclaimer</h3>
<ol>
   <li>The software and the accompanying documents as not to provide any express or implied, or guarantee in the form of compensation provided.</li>
   <li>User voluntary use of this software, you must understand the risks of using this software, technical services in the not to buy products before, we do not promise to provide any form of technical support, use of guarantees, nor liable for any use of this software issues related to liability arising.</li>
   <li>Hong Sing Company does not use the software to build a website or forum post or liable for the information, you assume full responsibility.</li>
   <li>Hong Sing company provides software and services in a timely manner, security, accuracy is not guaranteed, due to force majeure, Hong Sing factors beyond the control of the company (including hacker attacks, stopping power, etc.) caused by software and services Suspension or termination, and give your losses, you agree to Sing corporate responsibility waiver of all rights.</li>
   <li>Kangsheng Company does not guarantee the timeliness, safety and accuracy of the software and services provided by Kangsheng Company. The use of software and services are caused by force majeure factors and factors beyond the control of Kangsheng Company (including hacker attacks, power outages, etc.). If the suspension or termination causes losses to you, you agree to waive all rights to hold Kangsheng Company responsible.</li>
   <li>Kangsheng Company especially draws your attention that in order to protect the autonomy of the company’s business development and adjustment, Kangsheng Company has the right to modify the content of the service, suspend or terminate part or all of the software use and service at any time, with or without prior notice. , The amendment will be announced on the relevant page of the Kangsheng company’s website, once announced, it will be deemed as a notice. If Kangsheng Company exercises the right to modify or suspend or terminate part or all of the software use and service and cause losses, Kangsheng Company shall not be liable to you or any third party.</li>
</ol>

<p>Hong Sing products on the end user license agreement, business license and technical services to the details provided by the Hong Sing exclusive. Sing the company has without prior notice, modify the license agreement and services price list right to the modified agreement or price list from the change of the date of the new authorized user to take effect.</p>

<p>Once you start the installation Hong Sing products, shall be deemed to fully understand and accept the terms of this Agreement, the terms in the enjoyment of the rights granted at the same time, by the relevant constraints and restrictions. Licensing agreement outside the scope of acts would be a direct violation of this License Agreement and constitute an infringement, we have the right to terminate the authorization, shall be ordered to stop the damage, and retain the power to investigate related responsibilities.</p>

<p>The interpretation of the terms of the license agreement, validity, and dispute resolution, applicable to the mainland People\'s Republic of law.</p>

<p>Between Hong Sing if you and any dispute or controversy, should first be settled through friendly consultations, the consultation fails, you hereby agree to submit the dispute or controversy Sing Haidian District People\'s Court where jurisdiction. Hong Sing Company has the right to interpret the above terms and discretion.</p>

<p>(End of text)</p>

<p align="right">Kang Sheng</p>

</div>',

	'php_version_too_low' => 'Phiên bản PHP của bạn quá cũ, vui lòng nâng cấp phiên bản PHP của bạn lên '.$env_items['php']['r'].' và thử lại!',
	'php8_tips' => 'Chào bạn, nguồn bạn đang cài đặt không hỗ trợ PHP 8, trước tiên bạn vui lòng hạ cấp xuống PHP 7.4 rồi thử lại!',
	'no_utf8_tips' => 'Xin chào, phiên bản bạn đang sử dụng là phiên bản được mã hóa bản địa hóa như GBK / BIG-5, không còn là phiên bản phân phối chính nữa. Nếu bạn đang có kế hoạch tạo một trang web mới, thì [thực sự] nên sử dụng phiên bản chính thức UTF-8 mới nhất',
	'no_latest_tips' => 'Xin chào, bạn đang cài đặt phiên bản cũ có thể chứa lỗi cũng như rủi ro bảo mật. Nếu có thể, bạn nên cài đặt phiên bản tiếng Việt chính thức mới nhất.',
	'unstable_tips' => 'Xin chào, bạn đang cài đặt một phiên bản không chính thức. Có thể có lỗi hoặc vấn đề không xác định. Nếu bạn đang có ý định tạo một trang web hoặc mua một plugin mới. Bạn nên cài đặt phiên bản tiếng Việt chính thức mới nhất thì tốt hơn.',
	'next_tips' => '\r\nNhấp vào [OK] để chuyển đến trang tải xuống Discuz tiếng Việt mới nhất hoặc nhấp vào [Hủy] để tiếp tục cài đặt (không được khuyến nghị).',

	'uc_installed' => 'Bạn đã cài đặt UCenter, nếu bạn muốn cài đặt lại vui lòng xóa tập tin data/install.lock',
	'i_agree' => 'Tôi đã đọc và đồng ý với các điều khoản',
	'supportted' => 'Hỗ trợ',
	'unsupportted' => 'Ko hỗ trợ',
	'max_size' => 'Hỗ trợ/Tối đa',
	'project' => 'Dự án',
	'ucenter_required' => 'Yêu cầu',
	'ucenter_best' => 'Discuz!',
	'curr_server' => 'Hiện tại',
	'env_check' => 'Kiểm tra',
	'os' => 'OS',
	'php' => 'Bản PHP',
	'attachmentupload' => 'Đính kèm',
	'unlimit' => 'Không giới hạn',
	'version' => 'Phiên bản',
	'gdversion' => 'Bản GD',
	'allow' => 'Hỗ trợ',
	'unix' => 'Unix',
	'diskspace' => 'Đĩa cứng',
	'opcache' => 'OPcache',
	'curl' => 'Thư viện cURL',
	'priv_check' => 'Thư mục, tập tin',
	'func_depend' => 'Kiểm tra',
	'func_name' => 'Tên',
	'check_result' => 'Kết quả',
	'suggestion' => 'Khuyến nghị',
	'advice_mysql' => 'Kiểm tra chắc chắn các module mysql ko bị lỗi',
	'advice_fopen' => 'Chức năng này yêu cầu mở hàm allow_url_fopen trong php.ini.',
	'advice_file_get_contents' => 'Sửa trong php.ini hàm allow_url_fopen sang On để có thể cài đặt',
	'advice_xml' => 'Chức năng này yêu cầu có hỗ trợ XML trong PHP',
	'none' => 'Không có gì',

	'dbhost' => 'Máy chủ CSDL',
	'dbuser' => 'Tài khoản CSDL',
	'dbpw' => 'Mật khẩu CSDL',
	'dbname' => 'Tên CSDL',
	'tablepre' => 'Tiền tố',

	'ucfounderpw' => 'Mật khẩu',
	'ucfounderpw2' => 'Nhập lại',

	'init_log' => 'Khởi tạo Log',
	'clear_dir' => 'Thư mục trống',
	'select_db' => 'Chọn CSDL',
	'create_table' => 'Tạo bảng',
	'succeed' => 'Thành công ',

	'install_data' => 'Dữ liệu đang được cài đặt',
	'install_test_data' => 'Các dữ liệu đang được cài đặt',

	'method_undefined' => 'Không xác định phương pháp',
	'database_nonexistence' => 'CSDL không tồn tại',
	'skip_current' => 'Bỏ qua bước này',
	'topic' => 'Chủ đề',
	'install_finish' => 'Diễn đàn của bạn đã được cài đặt, nhấn vào đây để truy cập',

);

$msglang = array(
	'config_nonexistence' => 'Config.inc.php của bạn không tồn tại và bạn không thể tiếp tục cài đặt.',
);

?>