/*
 * @Author: hr
 * @Date: 2020-03-04 01:51:57
 * @LastEditors: hr
 * @LastEditTime: 2020-03-04 15:33:30
 * @Description: description
 */
/*
 * @Author: hr
 * @Date: 2020-03-04 01:51:57
 * @LastEditors: hr
 * @LastEditTime: 2020-03-04 14:36:42
 * @Description: description
 */

chrome.tabs.onActivated.addListener(function (activeInfo) {
    if (activeInfo.tabId) {
        chrome.tabs.get(activeInfo.tabId, function (tab) {
            // console.log('得到激活的tab：'+JSON.stringify(tab))
            if(tab.status == 'complete' && tab.url.startsWith('http')){
                console.log('后台发送active消息：'+JSON.stringify(tab))
                chrome.tabs.sendMessage(
                    tab.id,
                    {key: 'active',value: true}, 
                    function(response) {}
                )
            }
        });
    }
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.key == 'state'){
        console.log('后台收到消息啦，state='+request.value)
        chrome.tabs.query({}, function(tabs) {
            for(let tab of tabs){
                if(tab.url.startsWith('http')){
                    console.log('后台发送state消息：'+JSON.stringify(tab))
                    chrome.tabs.sendMessage(
                        tab.id,
                        {key: 'state',value: request.value},
                        function(response){}
                    )
                }
            }
        })
        return true
    }
})