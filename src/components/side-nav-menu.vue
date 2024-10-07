<template>
  <div
    class="dx-swatch-additional side-navigation-menu"
    @click="forwardClick"
  >
    <slot />
    <div class="menu-container">
      <dx-tree-view
        ref="treeViewRef"
        :items="items"
        key-expr="path"
        selection-mode="single"
        :focus-state-enabled="false"
        expand-event="click"
        @item-click="handleItemClick"
        width="100%"
      />
    </div>
  </div>
</template>

<script>
import DxTreeView from 'devextreme-vue/tree-view';
import { sizes } from '../utils/media-query';
import navigation from '../app-navigation';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  props: {
    compactMode: Boolean
  },
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();

    // Ekran hajmiga qarab elementlar kengaytiriladi yoki qisqartiriladi
    const isLargeScreen = sizes()['screen-large'];
    const items = navigation.map((item) => {
      if (item.path && !(/^\//.test(item.path))) {
        item.path = `/${item.path}`;
      }
      return { ...item, expanded: isLargeScreen };
    });

    const treeViewRef = ref(null);

    // Forward click voqeasi
    function forwardClick(...args) {
      context.emit("click", args);
    }

    // Elementlar click bo'lganda yo'naltirish
    function handleItemClick(e) {
      if (!e.itemData.path || props.compactMode) {
        return;
      }
      router.push(e.itemData.path);
      e.event.stopPropagation();
    }

    // Tanlangan elementni yangilash
    function updateSelection() {
      const treeViewInstance = treeViewRef.value?.instance;
      if (!treeViewInstance) return;

      treeViewInstance.selectItem(route.path);
      treeViewInstance.expandItem(route.path);
    }

    // Komponent yuklanganidan so'ng
    onMounted(() => {
      updateSelection();
      if (props.compactMode) {
        treeViewRef.value?.instance.collapseAll();
      }
    });

    // `route.path` yoki `compactMode` o'zgarganda
    watch(
      () => route.path,
      () => {
        updateSelection();
      }
    );

    watch(
      () => props.compactMode,
      () => {
        const treeViewInstance = treeViewRef.value?.instance;
        if (props.compactMode && treeViewInstance) {
          treeViewInstance.collapseAll();
        } else {
          updateSelection();
        }
      }
    );

    return {
      treeViewRef,
      items,
      forwardClick,
      handleItemClick,
      updateSelection
    };
  },
  components: {
    DxTreeView
  }
};
</script>

<style lang="scss">
@import "../dx-styles.scss";
@import "../themes/generated/variables.additional.scss";

.side-navigation-menu {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100%;
  width: 250px !important;
  background-color: rgb(90, 90, 90);

  .menu-container {
    min-height: 100%;
    display: flex;
    flex: 1;

    .dx-treeview {
      white-space: nowrap;

      .dx-treeview-item {
        padding-left: 0;
        flex-direction: row-reverse;

        .dx-icon {
          width: $side-panel-min-width !important;
          margin: 0 !important;
        }
      }

      .dx-treeview-node {
        padding: 0 0 !important;
      }

      .dx-treeview-toggle-item-visibility {
        right: 10px;
        left: auto;
      }

      .dx-rtl .dx-treeview-toggle-item-visibility {
        left: 10px;
        right: auto;
      }

      .dx-treeview-node {
        &[aria-level="1"] {
          font-weight: lighter;
        }

        &[aria-level="2"] .dx-treeview-item-content {
          font-weight: normal;
          padding: 0 $side-panel-min-width;
        }
      }
    }

    .dx-theme-generic .dx-treeview {
      .dx-treeview-node-container
        .dx-treeview-node.dx-state-selected.dx-state-focused
        > .dx-treeview-item
        * {
        color: rgb(0, 0, 0);
      }
    }
  }
}
</style>
