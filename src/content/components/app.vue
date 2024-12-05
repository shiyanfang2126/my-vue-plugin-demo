<template>
  <!-- 这里是网站页面的入口文件 -->
  <div class="content_page">
    <!-- <button class="fill-btn" @click="handleClick">数据</button> -->
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

// 填充表单函数
function fillForm(data) {
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
// 获取表单数据的函数
function getFormData() {
  const nameField = document.querySelector('#form_item_firstName');

  // 如果表单元素存在，返回表单数据
  if (nameField) {
    return {
      name: nameField.value
    };
  }

  // 如果没有找到表单，返回一个空对象
  return {};
}
// 监听popup.js发送的消息并执行填充表单操作
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillForm') {
    fillForm(request.data); // 填充表单
  }
  if (request.action === 'getFormData') {
    const formData = getFormData();
    sendResponse(formData); // 返回获取的表单数据
    // 将表单数剧存储到插件中
    // chrome.storage.local.set({ formData });
  }
});

onMounted(() => {
  // 使用 MutationObserver 监听 DOM 变化
  const observer = new MutationObserver(() => {
    if (checkForForm()) {
      insertButton();
    } else {
      // 如果页面中没有表单，则移除按钮
      const button = document.querySelector('#plugin-fill-button');
      if (button) {
        button.remove();
      }
    }
  });

  // 观察 DOM 变化，特别是子节点的变化
  observer.observe(document.body, { childList: true, subtree: true });
});

// 判断网页中是否有表单
function checkForForm() {
  const formElement = document.querySelector('form');
  return formElement !== null;
}

// 在网页中插入按钮
function insertButton() {
  // 检查页面是否已经插入按钮
  if (document.querySelector('#plugin-fill-button')) return;

  const formModalPosition = document
    .querySelector('.ant-modal-header')
    .getBoundingClientRect();

  // 创建填充按钮元素
  const button = document.createElement('button');
  button.id = 'plugin-fill-button';
  button.textContent = '填充数据';

  // 为按钮添加样式
  button.style.position = 'fixed';
  button.style.top = formModalPosition.y - 64 - 42 + 'px';
  button.style.left = formModalPosition.left + formModalPosition.x + 10 + 'px';
  button.style.height = '32px';
  button.style.lineHeight = '32px';
  button.style.padding = '0 16px';
  button.style.backgroundColor = '#4CAF50';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.zIndex = '9999';

  // 点击按钮时填充表单数据
  button.addEventListener('click', () => {
    const formData = {
      name: 'John Doe'
    };

    // 填充表单数据
    fillForm(formData);
  });

  // 创建收集按钮
  const collectionBtn = document.createElement('button');
  collectionBtn.id = 'plugin-collection-button';
  collectionBtn.textContent = '收集数据';

  // 为按钮添加样式
  collectionBtn.style.position = 'fixed';
  collectionBtn.style.top = formModalPosition.y - 64 - 42 + 'px';
  collectionBtn.style.left = formModalPosition.left + formModalPosition.x + 10 + 90 + 'px';
  collectionBtn.style.height = '32px';
  collectionBtn.style.lineHeight = '32px';
  collectionBtn.style.padding = '0 16px';
  collectionBtn.style.backgroundColor = '#4CAF50';
  collectionBtn.style.color = 'white';
  collectionBtn.style.border = 'none';
  collectionBtn.style.borderRadius = '5px';
  collectionBtn.style.cursor = 'pointer';
  collectionBtn.style.zIndex = '9999';

  // 点击按钮时填充表单数据
  collectionBtn.addEventListener('click', () => {
    getFormData()
  });

  // 将按钮插入到页面中
  document.body.appendChild(button);
  document.body.appendChild(collectionBtn);
}
</script>

<style lang="less" scoped>
.content_page {
  color: red;
  position: fixed;
  z-index: 100001;
  left: 10px;
  top: 10px;
  .content_page_main {
    color: green;
  }
}
.fill-btn {
  position: fixed;
  top: 78px;
  left: 700px;
  width: 100px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  color: white;
  font-size: 14px;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  border-radius: 4px;
  background-image: linear-gradient(114deg, #2f6cdf 0%, #6f6ae2 100%);
}
</style>
