<script setup lang="ts">
onMounted(() => {
  let script = document.createElement("script");
  script.setAttribute(
    "src",
    "https://telegram.org/js/telegram-widget.js?22"
  );
  script.setAttribute("data-telegram-login", "velorobot");
  script.setAttribute("data-size", "large");
  script.setAttribute("data-radius", "0");
  script.setAttribute("data-userpic", "false");
  script.setAttribute(
    "data-auth-url",
    "https://0bef-92-51-126-243.ngrok-free.app/login"
  );
  script.setAttribute("data-request-access", "write");
  document.getElementById("telegram")?.appendChild(script);
});
</script>

<template>
  <div id="telegram"></div>
</template>
