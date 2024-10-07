<template>
  <DxBullet
    :show-target="false"
    :show-zero-level="true"
    :value="cellData.value * 100"
    :start-scale-value="0"
    :end-scale-value="100"
  >
    <DxSize
      :width="150"
      :height="35" />
    <DxMargin
      :top="5"
      :bottom="0"
      :left="5" />
    <DxTooltip
      :enabled="true"
      :padding-top-bottom="2"
      :z-index="5"
      :customize-tooltip="customizeTooltip"
    >
      <DxFont :size="18" />
    </DxTooltip>
  </DxBullet>
</template>

<script setup>
import {
  DxBullet,
  DxFont,
  DxMargin,
  DxSize,
  DxTooltip,
} from 'devextreme-vue/bullet';
import { useAttrs } from 'vue'; // Vue 3 Composition API da props olish uchun

// Propsni olish uchun 'useAttrs' hookidan foydalaniladi
const props = useAttrs();

// cellData rekviziti props orqali keladi, shuning uchun uni olamiz
const cellData = props.cellData;

// Tooltip uchun moslashtirilgan funksiya
const customizeTooltip = (data) => ({
  text: `${parseInt(data.value, 10)}%`, // Tooltipda foiz ko‘rsatish uchun matn formatlash
});
</script>

<style>
.dx-datagrid .dx-data-row > td.bullet {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
