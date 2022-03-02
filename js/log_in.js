import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    login() {
      const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
      axios.post(api, this.user).then((response) => {
        console.log(response);
        const { token, expired } = response.data;
        // 寫入 cookie token
        // expires 設置有效時間
        document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
        //登入成功後跳轉到商品頁
        //window.location = 'products.html';
        window.location = 'productList.html';
      }).catch((error) => {
        alert(error.data.message);
      });
    },
  },
}).mount('#app');