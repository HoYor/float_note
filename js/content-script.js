/*
 * @Author: hr
 * @Date: 2019-12-23 23:04:44
 * @LastEditors: hr
 * @LastEditTime: 2020-03-04 14:36:28
 * @Description: description
 */

let g_note_width = 300
let g_note_height = 400
let g_action_height = 30
let CONFIG_PRIMARY_COLORS = [
	'#FFFFFF',
	'#FE4365',
	'#FC9D9A',
	'#F9CDAD',
	'#C8C8A9',
	'#83AF9B'
]
let g_primary_color = CONFIG_PRIMARY_COLORS[0]
let g_accent_color = '#26BCD5'
let g_note_float
let g_note_div
let g_note_input

// 得到浮在上层的按钮
function get_note_float(){
	let note_float = document.createElement('a')
	note_float.onclick = (e)=>{
		g_note_float.style.visibility = 'hidden'
		g_note_div.style.visibility = 'visible'
		save_note_state(0)
	}
	note_float.style.cursor = 'pointer'
	note_float.style.textDecoration = 'none'
	note_float.style.zIndex = '9999999'
	note_float.style.position = 'fixed'
	note_float.style.top = '50%'
	note_float.style.marginTop = '-25px'
	note_float.style.right = '0'
	note_float.style.backgroundColor = '#eeeeee'
	note_float.style.padding = '10px'
	note_float.style.boxShadow = '0px 0px 3px 2px rgba(100,100,100,0.2)'
	note_float.style.visibility = 'hidden'
	let note_float_img = document.createElement('img')
	let img_url = chrome.extension.getURL('img/pen.png')
	note_float_img.src = img_url
	note_float_img.style.width = '30px'
	note_float_img.style.height = '30px'
	note_float.appendChild(note_float_img)
	return note_float
}

// 得到面板
function get_note_div(){
	let note_div = document.createElement('div')
	note_div.style.zIndex = '10000000'
	note_div.style.position = 'fixed'
	note_div.style.top = '50%'
	note_div.style.marginTop = -g_note_width/2+'px'
	note_div.style.right = '0'
	note_div.style.backgroundColor = '#eeeeee'
	note_div.style.width = g_note_width+'px'
	note_div.style.height = g_note_height+'px'
	// 为了消除block的间隙
	note_div.style.fontSize = '0'
	note_div.style.boxShadow = '0px 0px 6px 3px rgba(100,100,100,0.3)'
	note_div.style.visibility = 'hidden'
	return note_div
}

// 得到输入区域
function get_note_input(){
	let note_input = document.createElement('textarea')
	note_input.onchange = save_data
	note_input.style.backgroundColor = g_primary_color
	note_input.style.width = g_note_width+'px'
	note_input.style.height = g_note_height-g_action_height+'px'
	note_input.style.boxSizing = 'border-box'
	note_input.style.color = '#333333'
	note_input.style.fontSize = '15px'
	note_input.style.lineHeight = '1.5'
	// note_input.style.fontWeight = 'bold'
	note_input.style.padding = '10px'
	note_input.style.border = '0'
	note_input.style.resize = 'none'
	note_input.style.outline = 'none'
	return note_input
}

// 设置面板当前状态
function save_note_state(state){
	// 0展开，1收起
	chrome.storage.sync.set({state: state}, function(items) {
		console.log('保存状态成功')
		chrome.runtime.sendMessage({key: "state",value: state}, function(response) {
			console.log('状态信息发送成功')
		});
	});
}

// 同步数据
function sync_data(){
	chrome.storage.sync.get({text: ''}, function(items) {
		console.log('得到保存的值：'+JSON.stringify(items))
		g_note_input.textContent = items.text
	});
}

// 保存数据
function save_data(){
	chrome.storage.sync.set({text: g_note_input.value}, function() {
		console.log('自动保存成功啦')
	});
}

// 同步状态
function sync_state(){
	// 0展开，1收起
	chrome.storage.sync.get({state: 0}, function(items) {
		console.log('得到保存的值：'+JSON.stringify(items))
		g_note_div.style.visibility = items.state == 1 ? 'hidden' : 'visible'
		g_note_float.style.visibility = items.state == 0 ? 'hidden' : 'visible'
	});
}

// 得到一个操作按钮
function get_note_btn(text,clickCallback,float = 'left'){
	let btn = document.createElement('a')
	btn.textContent = text
	btn.onclick = clickCallback;
	btn.style.cursor = 'pointer'
	btn.style.textDecoration = 'none'
	btn.style.float = float
	btn.style.display = 'inline_block'
	btn.style.lineHeight = g_action_height+'px'
	btn.style.height = g_action_height+'px'
	btn.style.fontSize = '14px'
	btn.style.color = g_accent_color
	btn.style.paddingLeft = '10px'
	btn.style.paddingRight = '10px'
	return btn
}

// 得到操作按钮区域
function get_note_btn_div(){
	let div = document.createElement('div')
	div.style.height = g_action_height
	let hide_btn = get_note_btn('收起',(e)=>{
		console.log('收起被点击啦')
		g_note_div.style.visibility = 'hidden'
		g_note_float.style.visibility = 'visible'
		save_note_state(1)
	})
	let always_btn = get_note_btn('自动折叠',(e)=>{})
	let clear_btn = get_note_btn('清除',(e)=>{
		g_note_input.textContent = ''
		save_data()
	},float = 'right')
	let new_btn = get_note_btn('新建',(e)=>{},float = 'right')
	div.appendChild(hide_btn)
	div.appendChild(always_btn)
	div.appendChild(clear_btn)
	div.appendChild(new_btn)
	return div
}

(function() {
	console.log('float-note启动啦！')
	g_note_div = get_note_div()
	g_note_float = get_note_float()
	g_note_input = get_note_input()
	sync_data()
	sync_state()
	g_note_div.appendChild(g_note_input)
	g_note_div.appendChild(get_note_btn_div())
	document.body.appendChild(g_note_float)
	document.body.appendChild(g_note_div)
})();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log('前台收到消息了')
	if (request.key == 'active'){
		sync_data()
	}else if(request.key == 'state'){
		sync_state()
	}
	sendResponse({'receive':'success'})
	return true
})