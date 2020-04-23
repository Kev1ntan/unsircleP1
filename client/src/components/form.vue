<template>
  <div id="container">
    <div id="form" >
      <div v-if="page === 'register'">
        <h2>Register</h2>
        <form @submit.prevent="register">
          <input type="text" v-model="formData.email" name="email" placeholder="Email" required><br><br>
          <input type="password" v-model="formData.password" name="password" placeholder="Password. eg:P4ssword" required><br><br>
          <div>
            <label>Profile</label><br>
            <input type="text" v-model="formData.fullName" name="fullname" placeholder="Fullname"><br><br>
            <input type="text" v-model="formData.companyName" name="companyName" placeholder="Company Name"><br><br>
            <input type="text" v-model="formData.phone" name="phone" placeholder="Phone" required><br><br>
          </div>
          <input type="text" v-model="formData.reference" name="reference" placeholder="Reference"><br>
          <div id="nav">
            <router-link class="link" to="/login">login</router-link>
          </div>
          <button>Submit</button>
        </form>
      </div>
      <div v-if="page === 'login'">
        <h2>Login</h2>
        <form @submit.prevent="login">
          <input type="text" v-model="formData.email" name="email" placeholder="email" required><br><br>
          <input type="password" v-model="formData.password" name="password" placeholder="password" required>
          <div id="login-nav">
            <router-link class="link" to="/forgotPassword">forgot password</router-link>
            <router-link class="link" to="/register">register</router-link>
          </div>
          <button>Submit</button>
        </form>
      </div>
      <div v-if="page === 'forgotPassword'">
        <h2>Reset Password</h2>
        <form @submit.prevent="resetPassword">
          <input type="text" v-model="formData.email" name="email" placeholder="email" required><br>
          <button>Submit</button>
        </form>
        <button @click="toLogin">Back</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        email: '',
        password: '',
        fullName: '',
        companyName: '',
        phone: '',
        reference: '',
      },
      page: 'login' ,
    }
  },
  mounted() {
    console.log(this.$router.currentRoute.name)
    if(this.$router.currentRoute.name === 'Login') {
      this.page = 'login'
    }else if(this.$router.currentRoute.name === 'Register') {
      this.page = 'register'
    }else if(this.$router.currentRoute.name === 'ForgotPassword') {
      this.page = 'forgotPassword'
    }
      console.log(this.page)
  },
  methods: {
    toLogin() {
      this.$router.push({ name: 'login'})
    },
    login() {
      console.log(this.formData.email,this.formData.password)
      this.$axios({
        url: '/gtw/login',
        method: 'POST',
        data: {
          "email": this.formData.email,
          "password": this.formData.password
        }
      })
       .then(resp=>{
         console.log(resp)
          if(resp.data.status === 'error') {
              this.formData.password = ''
              this.$swal.error(resp.data.message)
          }else{
            localStorage.setItem('token',resp.data.data.token)
            localStorage.setItem('user',resp.data.data.email)
            this.$swal.success('logged in')
            this.$router.push({ name: 'Home'})
          }
        })
        .catch(error=>{
          console.log(error)
        })
    },
    resetPassword() {
      console.log(this.formData.email)
       this.$axios({
        url: '/gtw/forgotPassword',
        method: 'POST',
        data: {
          "email": this.formData.email,
        }
      })
       .then(resp=>{
         console.log(resp.data.status)
         if(resp.data.status === 'ok') {
            this.$swal.info(resp.data.message)
            this.$router.push({ name: 'login'})
         }
        })
        .catch(error=>{
          this.$swal.error(error.response.data.message)
        })
    },
    register() {
      console.log(this.formData.email,"<<<email",this.formData.password,this.formData.fullName,this.formData.reference,this.formData.phone,this.formData.companyName,this.formData.url)
      this.$axios({
        url: '/gtw/register',
        method: 'POST',
        data: {
          email: this.formData.email,
          password: this.formData.password,
          profile: {
            full_name: this.formData.fullName,
            company_name: this.formData.companyName,
            phone: Number(this.formData.phone)
          },
          reference : this.formData.reference,
          url: 'https://api.unsircle.id/gtw/verification'
        }
      })
        .then(resp=>{
          console.log(resp)
          if(resp.data.status === 'error') {
            if(resp.data.message[0].param === "profile.phone") {
              this.$swal.error(`Nomor HP ${resp.data.message[0].msg}`)
            }else{
              this.$swal.error(resp.data.message[0].msg)
            }
          }else{
            this.$router.push({ name: 'login'})
            this.$swal.info(resp.data.message)
          }
        })
        .catch(error=>{
          console.log(error)
        })
    }
  }
}
</script>

<style>
#container {
  display: flex;
  align-items: center;
}
#form {
  display: flex;
  align-items: center;
  padding: 0px 20px 10px 20px;
  background-color: white;
}
#nav {
  text-align: right;
}
#login-nav {
  display: flex;
  justify-content: space-between;
}
input {
  background-color:rgb(238, 234, 234);
  font-size: 14px;
  color: black;
}
button:hover {
  background-color: rgb(55, 231, 55);
}
button {
  margin-top: 5px;
}
.link {
  margin-top: 2px;
  font-size: 12px;
  color: blue;
}
</style>