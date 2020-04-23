<template>
  <div class="register">
    <formpage/>
  </div>
</template>

<script>
// @ is an alias to /src
import formpage from "@/components/form.vue";

export default {
  name: "Register",
  components: {
    formpage
  }
};
</script>

<style scoped>
.register {
  display: flex;
  justify-content: center;
  background-image: url(https://images.pexels.com/photos/630754/autumn-orange-nature-red-630754.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260);
  background-size: cover;
  width: 100vw;
  height: 100vh;
}
</style>