<template>
  <div id="navbar">
    <div id="title">Unsircle</div>
    <button id="lb" @click="logout">Logout</button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      this.$swal.success('logged out')
      this.$router.push({ name: 'register'})
    }
  }
}
</script>

<style scoped>
#navbar {
  min-width: 200px;
  padding: 2px;
  display: flex;
  text-align: center;
  justify-content:space-between;
  align-items: center;
  height: 30px;
  background-color: darkgrey;
}
#title {
  font-size: 20px;
  font-weight: bold;
}
#lb:hover {
  background-color: red;
  color: white;
}
</style>