<script>
// Пока без пропсов, позже будет требоваться разное отображение в зависимости от наличия текста в textarea
// defineProps({
//   room: {
//     type: Object,
//     required: true,
//   },
// });

</script>

<template>
<div
  id="chat-input"
  class="chat-input">
  <div
    id=""
    class="chat-footer-wrapper">
    <div
      id="input-wrapper"
      class="textarea-wrapper">
      <div
        id="chat-input-buttons"
        class="chat-input-buttons">
        <div
          id="attach-button"
          class="attach-button"
          title="Attach file">
          <button class="rp btn-icon tgico icon-skrepka"/>
        </div>
      </div>
      <textarea 
        id="message-input" 
        spellcheck="false" 
        type="text" 
        autocomplete="off" 
        maxlength="1000" 
        placeholder="Write a message..." 
        data-scroll-element="true">
      </textarea>
    </div>
    <div
      class="send-button-container">
      <div
        id="send-button"
        class="send-button btn-container">
        <button class="inner tgico icon-send"/>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>