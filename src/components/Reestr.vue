<template>
  <div class="app-container">
    <!-- Yuqori panel: Yangi mijoz qo'shish -->
    <div class="top-panel">
      <button v-if="!isFormVisible" @click="toggleForm" class="btn-create">Янги мижоз қўшиш</button>
      <div v-else class="form-actions">
        <button @click="saveForm" class="btn-save">Сақлаш</button>
        <button @click="cancelForm" class="btn-cancel">Бекор қилиш</button>
      </div>
    </div>

    <!-- Mijoz kiritish paneli -->
    <div v-if="isFormVisible" class="customer-form-panel">
      <div class="panel-title">Мижоз</div>
      <dx-form :form-data="formData" col-count="2" label-location="top">
        <dx-group-item col-count="1" title="Мижоз">
          <dx-simple-item data-field="tashkilotStiri" label="Ташкилот СТИРи / ЯТТ ЖШШИРи" />
          <dx-simple-item data-field="manzil" label="Манзили" />
          <dx-simple-item data-field="tuman" label="Туман" />
          <dx-simple-item data-field="mfo" label="МФО" />
          <dx-simple-item data-field="ifud" label="ИФУД (ОКЭД)" editor-type="dxNumberBox" />
          <dx-simple-item data-field="rahbarPinfl" label="Рахбар ЖШШИР (ПИНФЛ)" />
          <dx-simple-item data-field="telefon" label="Телефон рақами" />
          <dx-simple-item data-field="ishchilarSoni" label="Хакикатда хозирги кундаги ишчилар сони" editor-type="dxNumberBox" />
        <dx-group-item>
          <dx-simple-item data-field="Tasischilar" label="Tasischilar" editor-type="dxTextBox" />
        </dx-group-item>
        </dx-group-item>
        <dx-group-item col-count="1">
          <dx-simple-item data-field="tashkilotNomi" label="Ташкилот номи" />
          <dx-simple-item data-field="viloyat" label="Вилоят" />
          <dx-simple-item data-field="maxalla" label="Махалла" />
          <dx-simple-item data-field="hisobRaqami" label="Хисоб рақами" />
          <dx-simple-item data-field="rahbar" label="Рахбар" />
          <dx-simple-item data-field="rahbarStiri" label="Рахбар СТИРи" />
          <dx-simple-item data-field="jins" label="Тадбиркорлик субъект раҳбарининг жинси" editor-type="dxSelectBox" :editor-options="{ items: genders }" />
        </dx-group-item>
      </dx-form>
    </div>

    <!-- Pastki panel: Qidiruv va Jadval -->
    <div class="content-panel" v-if="!isFormVisible">
      <div class="search-panel">
        <h3>Излаш критериялари</h3>
        <dx-form :form-data="searchCriteria">
          <dx-simple-item data-field="mijozInn" label="Мижоз ИННси" editor-type="dxNumberBox" />
          <dx-simple-item data-field="boshBank" label="Бош Банк" editor-type="dxSelectBox" />
          <dx-simple-item data-field="filialMfo" label="Худуд/Банк Филиали МФО ???" editor-type="dxSelectBox" />
        </dx-form>
        <button @click="searchRecords" class="btn-search">Излаш</button>
      </div>

      <div class="result-panel">
        <div class="table-container">
          <table class="result-table">
            <thead>
              <tr>
                <th>Мижоз номи</th>
                <th>Мижоз ИННси</th>
                <th>Бош Банк</th>
                <th>Худуд/Банк Филиали МФО</th>
                <th>Ажратилган кредит суммаси</th>
                <th>Кредит</th>
                <th>Амаллар</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(customer, index) in customers" :key="index">
                <td>{{ customer.tashkilotNomi }}</td>
                <td>{{ customer.tashkilotStiri }}</td>
                <td>{{ customer.boshBank }}</td>
                <td>{{ customer.mfo }}</td>
                <td>{{ customer.creditAmount }}</td>
                <td>{{ customer.credit }}</td>
                <td>
                  <button @click="editCustomer(index)" class="btn-edit">Ўзгартириш</button>
                  <button @click="deleteCustomer(index)" class="btn-delete">Ўчириш</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Footer Section -->
    <div class="footer-panel">
      <p>© 2024 Mijozlar Ma'lumotnomasi</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import 'devextreme/dist/css/dx.light.compact.css';
import { DxForm, DxGroupItem, DxSimpleItem } from 'devextreme-vue/form';

export default {
  components: {
    DxForm,
    DxGroupItem,
    DxSimpleItem,
  },
  setup() {
    const isFormVisible = ref(false);
    const formData = reactive({
      tashkilotStiri: '',
      manzil: '',
      tuman: '',
      mfo: '',
      ifud: 0,
      rahbarPinfl: '',
      telefon: '',
      ishchilarSoni: 0,
      tashkilotNomi: '',
      viloyat: '',
      maxalla: '',
      hisobRaqami: '',
      rahbar: '',
      rahbarStiri: '',
      jins: null,
      creditAmount: 0,
      credit: '',
    });

    const searchCriteria = reactive({
      mijozInn: 0,
      boshBank: '',
      filialMfo: '',
    });

    const genders = ['Мужской', 'Женский'];
    const customers = ref([]);

    const toggleForm = () => {
      isFormVisible.value = !isFormVisible.value;
      if (isFormVisible.value) {
        // Mijozlar ro'yxatini tozalash
        customers.value = [];
      }
    };

    const saveForm = () => {
      customers.value.push({ ...formData });
      localStorage.setItem('customers', JSON.stringify(customers.value));
      alert('Маълумотлар сақланди!');
      isFormVisible.value = false;
      clearFormData();
    };

    const cancelForm = () => {
      isFormVisible.value = false;
      clearFormData();
    };

    const clearFormData = () => {
      Object.assign(formData, {
        tashkilotStiri: '',
        manzil: '',
        tuman: '',
        mfo: '',
        ifud: 0,
        rahbarPinfl: '',
        telefon: '',
        ishchilarSoni: 0,
        tashkilotNomi: '',
        viloyat: '',
        maxalla: '',
        hisobRaqami: '',
        rahbar: '',
        rahbarStiri: '',
        jins: null,
        creditAmount: 0,
        credit: '',
      });
    };

    const editCustomer = (index) => {
      Object.assign(formData, { ...customers.value[index] });
      isFormVisible.value = true;
    };

    const deleteCustomer = (index) => {
      customers.value.splice(index, 1);
      localStorage.setItem('customers', JSON.stringify(customers.value));
    };

    const searchRecords = () => {
      // Izlash funksiyasi shu yerda qo‘shiladi
    };

    onMounted(() => {
      const savedCustomers = localStorage.getItem('customers');
      if (savedCustomers) {
        customers.value = JSON.parse(savedCustomers);
      }
    });

    return {
      isFormVisible,
      formData,
      searchCriteria,
      genders,
      customers,
      toggleForm,
      saveForm,
      cancelForm,
      clearFormData,
      editCustomer,
      deleteCustomer,
      searchRecords,
    };
  },
};
</script>

<style scoped>
/* UI ni moslashtirish */
.app-container {
  display: flex;
  flex-direction: column;
}

.top-panel {
  display: flex;
  justify-content: flex-end; /* Tugmani o'ng tarafga joylashtirish */
  align-items: center;
  padding: 10px 20px;
  width: 100%;
}

.page-title {
  flex: 1; /* Title uchun bo'sh joy */
  text-align: center;
}

.btn-create {
  margin-left: 10px; /* Tugmalar orasida bo'sh joy */
}

.content-panel {
  display: flex;
  flex-direction: row;
}

.search-panel {
  width: 20%;
  padding: 20px;
  border-right: 1px solid #ccc;
  overflow-y: auto;
}

.result-panel {
  width: 80%;
  padding: 20px;
  overflow: auto;
}

.table-container {
  max-height: 400px; /* Jadvalning maksimal balandligini belgilang */
  overflow: auto; /* Vertikal va gorizontal skroll qo'llash uchun */
}

.result-table {
  width: 100%;
  border-collapse: collapse;
}

.result-table th,
.result-table td {
  padding: 10px;
  border: 1px solid #ddd;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.btn-create,
.btn-search,
.btn-save,
.btn-cancel,
.btn-edit,
.btn-delete {
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;
}

/* Izlash bo'limi shriftini kichiklashtirish */
.search-panel h3 {
  font-size: 14px; /* O'lchamni 2 baravar kichik qilinadi */
}

.overflow-scroll {
  overflow: auto; /* Ortacha skroll funksiyasi uchun */
}
.dx-field-item {
  width: 100%;
}

</style>