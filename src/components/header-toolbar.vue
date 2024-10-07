<template>
  <header class="header-component">
    <dx-toolbar class="header-toolbar">
      <!-- Til paneli -->
      <dx-item location="after" class="language-panel">
        <template #default>
          <dx-button
            class="language-button"
            icon="globe"
            :text="currentLanguage"
            styling-mode="text"
            @click="toggleLanguageMenu"
          />
          <div v-if="languageMenuVisible" class="language-menu-container">
            <dx-list
              :data-source="languageMenuItems"
              width="auto"
              position="bottom"
              @item-click="changeLanguage"
              class="menu"
            >
              <template #item="{ data }">
                <div class="menu-item">
                  <dx-icon :name="data.icon" />
                  {{ data.text }}
                </div>
              </template>
            </dx-list>
          </div>
        </template>
      </dx-item>

      <!-- Foydalanuvchi bank bo'limini qo'shish -->
      <dx-item location="after" class="user-panel-container">
        <template #default>
          <dx-button
            class="user-button"
            icon="user"
            :text="'БАНК ФИЛИАЛ'"
            styling-mode="text"
            @click="toggleUserMenu"
          />
          <div v-if="userMenuVisible" class="user-menu-container">
            <dx-list
              :data-source="userMenuItems"
              width="auto"
              position="bottom"
              @item-click="onUserMenuClick"
              class="menu"
            >
              <template #item="{ data }">
                <div class="menu-item">
                  <dx-icon :name="data.icon" />
                  {{ data.text }}
                </div>
              </template>
            </dx-list>
          </div>
        </template>
      </dx-item>
    </dx-toolbar>
  </header>
</template>

<script>
import DxButton from "devextreme-vue/button";
import DxToolbar, { DxItem } from "devextreme-vue/toolbar";
import DxList from "devextreme-vue/list";
import auth from "../auth";
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
  setup() {
    const router = useRouter();

    // Foydalanuvchi emaili uchun state
    const email = ref("");
    auth.getUser().then((e) => {
      email.value = e.data.email;
    });

    // Foydalanuvchi menyusi elementlari
    const userMenuItems = [
      { text: "Profil", icon: "user", onClick: () => router.push("/profile") },
      { text: "Parolni o'zgartirish", icon: "key", onClick: () => router.push("/change-password") },
      { text: "Chiqish", icon: "runner", onClick: logOut },
    ];

    // Til menyusi elementlari
    const languageMenuVisible = ref(false);
    const userMenuVisible = ref(false);
    const currentLanguage = ref("O'zbek (Lotin)"); // Dastlabki til
    const languageMenuItems = [
      { text: "Узбек тили(Кирилл)", value: "Узбек тили(Кирилл)", icon: "check" },
      { text: "Узбек тили (Лотин)", value: "Узбек тили (Лотин)", icon: "check" },
      { text: "Русский", value: "Русский", icon: "check" },
      { text: "Английский", value: "Английский", icon: "check" }
    ];

    function changeLanguage(item) {
      currentLanguage.value = item.value; // Tanlangan tilni yangilash
      languageMenuVisible.value = false; // Menyuni yopish
      console.log(`Til o'zgartirildi: ${currentLanguage.value}`);
    }

    function toggleLanguageMenu() {
      userMenuVisible.value = false; // Foydalanuvchi menyusini yoping
      languageMenuVisible.value = !languageMenuVisible.value; // Til menyusini ochish/yopish
    }

    function toggleUserMenu() {
      languageMenuVisible.value = false; // Til menyusini yoping
      userMenuVisible.value = !userMenuVisible.value; // Foydalanuvchi menyusini ochish/yopish
    }

    function logOut() {
      // Tizimdan chiqish va ma'lumotlarni tozalash
      console.log("Tizimdan chiqildi");
      router.push("/login-form");
    }

    function onUserMenuClick(item) {
      item.onClick && item.onClick(); // Foydalanuvchi menyusi tugmachasini bosganda ishlatiladigan funksiya
      userMenuVisible.value = false; // Menyuni yopish
    }

    return {
      email,
      userMenuItems,
      changeLanguage,
      toggleLanguageMenu,
      toggleUserMenu,
      languageMenuVisible,
      userMenuVisible,
      currentLanguage,
      languageMenuItems,
      onUserMenuClick,
    };
  },
  components: {
    DxButton,
    DxToolbar,
    DxItem,
    DxList,
  },
};
</script>

<style scoped>
.header-component {
  display: flex;
  justify-content: flex-end; /* Align items to the right */
  align-items: center;
  padding: 10px;
  background: #f5f5f5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%; /* Ensure the header takes full width */
}

.language-panel, .user-panel-container {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.language-button, .user-button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.language-button .dx-icon, .user-button .dx-icon {
  margin-right: 5px; /* Space between icon and text */
}

/* Til menyusi uchun stil */
.language-menu-container {
  position: absolute;
  top: 100%;
  right: 15px; /* Til menyusini o‘ng tarafga joylashtirish */
  width: auto;
  margin-top: 10px;
  z-index: 999;
}

/* Foydalanuvchi menyusi uchun stil */
.user-menu-container {
  position: absolute;
  top: 100%;
  right: 150px; /* Foydalanuvchi menyusini o‘ng tarafga yaqinroq joylashtirish */
  width: auto;
  margin-top: 10px;
  z-index: 999;
}

/* General menu styles */
.menu {
  background-color: #ffffff; /* White background */
  border-radius: 4px; /* Rounded corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Shadow */
  padding: 0; /* No extra padding */
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
}

.menu-item:hover {
  background-color: #f0f0f0; /* Hover effect */
}
</style>
