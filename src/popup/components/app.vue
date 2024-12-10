<template>
  <div class="popup">
    <!-- 弹框的页面 -->
    <h3>填充表单</h3>
    <form>
      <div>
        <label for="name">firStName：</label>
        <input v-model="form.firstName" type="text" id="name" required />
      </div>
    </form>
    <div class="btn-group">
      <button @click="submitForm">填充表单</button>
      <button @click="fetchFormData">获取当前表单数据</button>
    </div>
    <h3>收集的表单数据</h3>
    <p v-for="(item, index) in formData" :key="index">{{ index }}: {{ item }}</p>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
const form = reactive({
  firstName: 'FirstNameTest',
  lastName: 'lastNameTest',
  gender: 'Male',
  dob: '12/05/1999',
  driversLicenseNumber: '1234567890',
  address: 'AddressTest'
});
const formData = ref(null);

const submitForm = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'fillForm',
      data: this.form
    });
  });
};
const fetchFormData = () => {
  formData.value = localStorage.getItem('formData');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getFormData' }, (response) => {
      formData.value = response; // 将获取到的表单数据存储在 formData 中
    });
  });
};

onMounted(() => {
  formData.value = localStorage.getItem('formData'); // 从本地存储中获取表单数据
})
</script>

<style scoped>
.popup {
  width: 300px;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.popup h3 {
  margin-bottom: 15px;
}

.popup label {
  display: block;
  margin: 5px 0;
}

.popup input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

.popup button {
  width: 100%;
  padding: 10px;
  background-image: linear-gradient(114deg, #2f6cdf 0%, #6f6ae2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.popup button:hover {
  background-image: linear-gradient(114deg, #134ebc 0%, #a625f0 100%);
}
.btn-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
</style>
