<template>
  <div class="popup">
	<!-- 弹框的页面 -->
    <h3>填充表单</h3>
    <form>
      <div>
        <label for="name">firStName：</label>
        <input v-model="form.name" type="text" id="name" required />
      </div>
    </form>
		<div class="btn-group">
			<button @click="submitForm">填充表单</button>
			<button @click="fetchFormData">获取当前表单数据</button>
		</div>
		<h3>收集的表单数据</h3>
    <p v-if="formData">firStName：{{ formData.name }}</p>
		<p v-if="!formData">没有表单数据</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: ''
      },
			formData: null
    };
  },
  methods: {
    // 向当前活跃的标签页发送填充表单请求
    submitForm() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'fillForm',
          data: this.form
        });
      });
    },
		fetchFormData() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getFormData' }, (response) => {
          this.formData = response; // 将获取到的表单数据存储在 formData 中
        });
      });
    }
  }
};
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
