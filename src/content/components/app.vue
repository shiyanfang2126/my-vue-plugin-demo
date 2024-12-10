<template>
  <div class="content_page">
    <!-- 插件的填充按钮和数据收集按钮将被动态插入到页面中 -->
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const inputEvent = new Event('input', { bubbles: true });
const changeEvent = new Event('change', { bubbles: true });
// const clickEvent = new MouseEvent('click', { bubbles: true });
const enterEvent = new KeyboardEvent('keydown', { bubbles: true, keyCode: 13 });
const focusEvent = new Event('focus', { bubbles: true });

// 填充表单函数
function fillForm(data) {
  const formElements = document.querySelectorAll('input, textarea, .ant-select');
  formElements.forEach((field) => {
    const fieldName = field.name || field.id.split('_')[2];
    const value = data[fieldName];
    
    if (fieldName && value !== undefined) {
       if (field.classList.contains('ant-select')) {
        // 处理 a-select 元素
        const selectElement = field.querySelector('.ant-select-selector');
        const selectInput = field.querySelector('input');
        if (selectElement) {
          // 模拟点击事件选择项
          const item = Array.from(field.querySelectorAll('.ant-select-item')).find(opt => opt.textContent.trim() === value);
          if (item) {
            item.click(); // 模拟点击选项
            selectInput.dispatchEvent(changeEvent); // 触发 change 事件
            selectInput.dispatchEvent(enterEvent); // 模拟回车事件
          }
        }
      } else if (field.classList.contains('ant-date-picker')) {
        // 处理 a-date-picker 元素
        const dateInput = field.querySelector('input');
        if (dateInput) {
          dateInput.dispatchEvent(changeEvent); // 触发 change 事件
          dateInput.dispatchEvent(focusEvent); // 模拟输入事件
          dateInput.value = value;
          dateInput.dispatchEvent(inputEvent); // 模拟输入事件
          dateInput.dispatchEvent(enterEvent); // 模拟回车事件
        }
      } else {
        // 处理普通的 input 和 textarea 元素
        field.value = value;
      }
      field.dispatchEvent(inputEvent);
      field.dispatchEvent(changeEvent);
    }
  });
}

// 获取表单数据的函数
function getFormData() {
  const formData = {};
  const formElements = document.querySelectorAll('input, select, textarea');

  formElements.forEach((field) => {
    const fieldName = field.name || field.id.split('_')[1];
    if (!fieldName) return;

    const fieldValue =
      field.type === 'checkbox' ? field.checked
      : field.type === 'radio' && field.checked ? field.value
      : field.value;

    const keys = fieldName.split('.'); // 支持嵌套，如 form.firstName
    let current = formData;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = fieldValue; // 最后一个键直接赋值
      } else {
        current[key] = current[key] || {}; // 中间的键创建对象
        current = current[key];
      }
    });
  });

  // 存储到 chrome.storage.local
  chrome.storage.local.set({ formData });
  return formData;
}

// 监听 popup.js 发送的消息并执行填充表单操作
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillForm') {
    fillForm(request.data); // 填充表单
  }
  if (request.action === 'getFormData') {
    const formData = getFormData();
    sendResponse(formData); // 返回获取的表单数据
  }
});

onMounted(() => {
  // 使用 MutationObserver 监听 DOM 变化
  const observer = new MutationObserver(() => {
    if (checkForForm()) {
      insertButton();
    } else {
      // 如果页面中没有表单，则移除按钮
      removeButton();
    }
  });

  // 观察 DOM 变化，特别是子节点的变化
  observer.observe(document.body, { childList: true, subtree: true });
});

// 判断网页中是否有表单
function checkForForm() {
  return document.querySelector('form') !== null;
}

// 插入按钮到页面
function insertButton() {
  if (document.querySelector('#plugin-fill-button')) return;

  const formModalPosition = document.querySelector('.ant-modal-header')?.getBoundingClientRect();
  if (!formModalPosition) return; // 如果没有找到 Modal Header，停止

  const button = document.createElement('button');
  button.id = 'plugin-fill-button';
  button.textContent = '填充数据';

  // 为按钮添加样式
  button.style.position = 'fixed';
  button.style.top = formModalPosition.y - 64 - 42 + 'px';
  button.style.left = formModalPosition.left + formModalPosition.x + 10 + 'px';
  
  button.classList.add('fill-btn');

  // 点击按钮时填充表单数据
  button.addEventListener('click', () => {
    const formData = {
      firstName: 'FirstNameTest',
      lastName: 'lastNameTest',
      gender: 'Female',
      dob: '12/05/1999',
      driversLicenseNumber: '1234567890',
      address: 'AddressTest'
    };
    fillForm(formData);
  });

  const collectionBtn = document.createElement('button');
  collectionBtn.id = 'plugin-collection-button';
  collectionBtn.textContent = '收集数据';

  // 为按钮添加样式
  collectionBtn.style.position = 'fixed';
  collectionBtn.style.top = formModalPosition.y - 64 - 42 + 'px';
  collectionBtn.style.left = formModalPosition.left + formModalPosition.x + 10 + 90 + 'px';
  collectionBtn.classList.add('fill-btn');

  // 点击按钮时填充表单数据
  collectionBtn.addEventListener('click', () => {
    getFormData();
  });

  document.body.appendChild(button);
  document.body.appendChild(collectionBtn);
}

// 移除插入的按钮
function removeButton() {
  const button = document.querySelector('#plugin-fill-button');
  const collectionBtn = document.querySelector('#plugin-collection-button');

  if (button) button.remove();
  if (collectionBtn) collectionBtn.remove();
}

</script>

<style scoped>
.content_page {
  color: red;
  position: fixed;
  z-index: 100001;
  left: 10px;
  top: 10px;
}

.fill-btn {
  position: fixed;
  width: 100px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  color: white;
  font-size: 14px;
  border-radius: 4px;
  background-image: linear-gradient(114deg, #2f6cdf 0%, #6f6ae2 100%);
  z-index: 99999;
}
</style>
