<template>
  <div>
    <h2 class="content-block">Home</h2>
    <div class="content-block">
      <div class="dx-card responsive-paddings">
        <DxDataGrid
          :data-source="dataSource"
          :remote-operations="false"
          :allow-column-reordering="true"
          :row-alternation-enabled="true"
          :show-borders="true"
          :width="'100%'"
          @content-ready="onContentReady"
        >
          <DxColumn
            :group-index="0"
            data-field="Product"
          />
          <DxColumn
            data-field="Amount"
            caption="Sale Amount"
            data-type="number"
            format="currency"
            alignment="right"
          />
          <DxColumn
            :allow-grouping="false"
            data-field="Discount"
            caption="Discount %"
            data-type="number"
            format="percent"
            alignment="right"
            cell-template="discountCellTemplate"
            css-class="bullet"
          />
          <DxColumn
            data-field="SaleDate"
            data-type="date"
          />
          <DxColumn
            data-field="Region"
            data-type="string"
          />
          <DxColumn
            data-field="Sector"
            data-type="string"
          />
          <DxColumn
            data-field="Channel"
            data-type="string"
          />
          <DxColumn
            :width="150"
            data-field="Customer"
            data-type="string"
          />

          <DxGroupPanel :visible="true"/>
          <DxSearchPanel
            :visible="true"
            :highlight-case-sensitive="true"
          />
          <DxGrouping :auto-expand-all="false"/>
          <DxPager
            :allowed-page-sizes="pageSizes"
            :show-page-size-selector="true"
          />
          <DxPaging :page-size="10"/>

          <!-- Discount Cell Template -->
          <template #discountCellTemplate="{ data: cellData }">
            <DiscountCell :cell-data="cellData"/>
          </template>

        </DxDataGrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
} from 'devextreme-vue/data-grid';
import DataSource from 'devextreme/data/data_source';
import 'devextreme/data/odata/store';

const dataSource = new DataSource({
  store: {
    type: 'odata',
    version: 2,
    url: 'https://js.devexpress.com/Demos/SalesViewer/odata/DaySaleDtoes',
    key: 'Id',
    beforeSend(request) {
      const year = new Date().getFullYear() - 1;
      request.params.startDate = `${year}-05-10`;
      request.params.endDate = `${year}-5-15`;
    },
  },
});

const pageSizes = [10, 25, 50, 100];

let collapsed = false;

const onContentReady = (e) => {
  if (!collapsed) {
    e.component.expandRow(['EnviroCare']);
    collapsed = true;
  }
};
</script>

<style lang="scss">
.logos-container {
  margin: 20px 0 40px 0;
  text-align: center;
  svg {
    display: inline-block;
  }
}

.devextreme-logo {
  width: 200px;
  height: 34px;
  margin-bottom: 17px;
}

.vue-logo {
  width: 180px;
  height: 62px;
}

.plus {
  margin: 20px 10px;
  width: 22px;
  height: 22px;
}

.screen-x-small .logos-container {
  svg {
    width: 100%;
    display: block;
    &.plus {
      margin: 0;
    }
  }
}
</style>
