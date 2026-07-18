<script setup>
</script>

<template>
<div
  id="column-left"
  data-search-parent-container>
  <div
    class="sidebar-header content-container-wrapper">
    <div
      class="sidebar-header-inner">

      <div
        id="menu_btn"
        class="btn-container">
        <button class="rp btn-icon tgico icon-burger" title="Open menu" />
      </div>

      <div
        class="input-search">
        <input id="searchInput" class="input-search-input" type="text" autocomplete="off">

        <span class="input-search-part input-search-icon tgico icon-search" />

        <span id="searchPlaceholder" class="input-search-placeholder">
          Поиск
        </span>

        <span id="clearButton" class="input-search-part input-search-icon tgico icon-close" style="display:none" />
      </div>

    </div>

    <div
      id="chat-list-options" />
  </div>

  <div
    id="row-list"
    class="row-list"
    data-menu-position-container>
    <div
      id="chat-list"
      class="chat-list"
      data-menu-host />

    <div
      id="message-list"
      class="chat-list" />
  </div>
</div>
</template>

<style scoped>

</style>