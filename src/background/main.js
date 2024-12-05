import hotReload from '@/utils/hotReload'

// 热更新
hotReload()
// background.js

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'fillForm') {
    // 获取当前活跃的标签页
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // 向当前标签页发送填充数据的消息
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: fillForm,
        args: [request.data]
      });
    });
  }
  if (request.action === 'sendFormData') {
    const formData = request.data;
    console.log('接收到表单数据:', formData);

    // 可以将数据传递给插件的其他部分，如弹出窗口或存储等
    chrome.storage.local.set({ formData: formData });
  }
});

const fillForm = (data) => {
  const nameField = document.querySelector('#form_item_firstName');

  if (nameField) {
    // 填充数据
    nameField.value = data.name || '';
    
    // 手动触发事件，确保网页能够同步输入值
    nameField.dispatchEvent(new Event('input', { bubbles: true }));
    
    // 如果是表单提交按钮或者相关控件需要 change 事件
    nameField.dispatchEvent(new Event('change', { bubbles: true }));
  }
}
