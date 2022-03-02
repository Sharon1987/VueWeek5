import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
let productModal = null;
let delProductModal = null;

const app =createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'sharon1987',
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
      pagination: {},
    }
  },
  methods: {
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message)
          window.location = 'index.html';
        })
    },
    getData(page = 1) {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;

      axios.get(url)
        .then((response) => {
          const { products, pagination } = response.data;
          this.products = products;
          this.pagination = pagination;
        }).catch((err) => {
          alert(err.data.message);
          window.location = 'login.html';
        })
    },
    openModal(modalStatus, item) {
      if (modalStatus === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (modalStatus === 'edit') {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (modalStatus === 'delete') {
        this.tempProduct = { ...item };
        delProductModal.show()
      }
    },
  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common.Authorization = token;
    this.checkAdmin();
  },
});

// 建立分頁元件
app.component('pagination', {
  template: '#pagination',
  props: ['pages'],
  methods: {
    emitPages(item) {
      this.$emit('emit-pages', item);
    },
  },
});

// 建立新增/編輯產品的元件Modal
app.component('productModal', {
  template: '#productModal',
  props: ['product', 'isNew'],
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'sharon1987',
      modal: null,
    };
  },
  mounted() {
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false,
      backdrop: 'static'
    });
  },
  methods: {
    updateProduct() {
      // 預設為新增商品
      let api = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let http = 'post';
      // 如果不是新增商品的話切改成打編輯商品的API
      if (!this.isNew) {
        api += `/${this.product.id}`;
        http = 'put';
      }

      axios[http](api, { data: this.product }).then((response) => {
        alert(response.data.message);
        this.hideModal();
        this.$emit('update');
      }).catch((error) => {
        alert(error.data.message);
      });
    },
    createImages() {
      this.product.imagesUrl = [];
      this.product.imagesUrl.push('');
    },
    openModal() {
      productModal.show();
    },
    hideModal() {
      productModal.hide();
    },
  },
})
// 產品刪除元件Modal視窗
app.component('delProductModal', {
  template: '#delProductModal',
  props: ['item'],
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'sharon1987',
      modal: null,
    };
  },
  mounted() {
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false,
      backdrop: 'static',
    });
  },
  methods: {
    delProduct() {
      axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.item.id}`).then((response) => {
        this.hideModal();
        this.$emit('update');
      }).catch((error) => {
        alert(error.data.message);
      });
    },
    openModal() {
      delProductModal.show();
    },
    hideModal() {
      delProductModal.hide();
    },
  },
});

app.mount('#app');