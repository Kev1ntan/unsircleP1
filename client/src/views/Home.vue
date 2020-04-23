<template>
  <div class="home">
    <navbar/>
    <h3>welcome {{email}}</h3>
  </div>
</template>

<script>
// @ is an alias to /src
import navbar from "@/components/navbar.vue";

export default {
  name: "home",
  data() {
    return {
      email: '' ,
    }
  },
  created() {
    this.email = localStorage.user
  },
  components: {
    navbar
  }
};
</script>