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
          <button class="btn">Submit</button>
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
          <button class="btn">Submit</button>
        </form>
      </div>
      <div v-if="page === 'forgotPassword'">
        <h2>Reset Password</h2>
        <form @submit.prevent="resetPassword">
          <input type="text" v-model="formData.email" name="email" placeholder="email" required><br>
          <button class="btn">Submit</button>
        </form>
        <button class="btn" @click="toLogin">Back</button>
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
    validation(fitur) {
      let messages = []
      let password = this.formData.password
      let phone = this.formData.phone
      let re = /\S+@\S+\.\S+/
      if(this.formData.email.trim() === ''){
        messages.push('please input email')
      }else if(re.test(this.formData.email.trim()) === false){
        messages.push('please input valid email format')
      }
      if(fitur === 'login') {
        if(password.trim() === ''){
          messages.push('please input password')
        }
      }else if(fitur === 'register') {
        let r = /\d+/
        let upperCase = false
        let number = false
        for(let i = 0; i < password.length; i++) {
          if(password[i] === password[i].toUpperCase()){
            upperCase = true
          }
          if(this.formData.email.match(r)){
            number = true
          }
          if(upperCase && number){
            break;
          }
        }
        if(password.trim() === '' || upperCase === false || number === false){
          messages.push('password length min 8(contain Uppercase letter and number)')
        }
        if(phone.trim() === '' || phone.trim().length < 7 || phone.trim().length > 12){
          messages.push('please input phone number 8-13 digits')
        }
      }
      console.log(messages)
      return messages
    },
    toLogin() {
      this.$router.push({ name: 'login'})
    },
    login() {
      console.log(this.formData.email,this.formData.password)
      let errors = this.validation('login')
      if(errors.length === 0){
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
      }else {
        console.log(errors,"<<")
        this.$swal.error(errors.join(', '))
      }
    },
    resetPassword() {
      let errors = this.validation()
      console.log(this.formData.email)
      if(errors.length === 0){
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
      }else {
        this.$swal.error(errors.join(', '))
      }
    },
    register() {
      console.log(this.formData.email,"<<<email",this.formData.password,this.formData.fullName,this.formData.reference,this.formData.phone,this.formData.companyName,this.formData.url)
      let errors = this.validation('register')
      if(errors.length === 0){
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
      }else {
        this.$swal.error(errors.join(', '))
      }
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
  padding: 0px 25px 10px 25px;
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
  font-weight: bold;
  background-color: rgb(55, 231, 55);
}
.btn {
  width: 65px;
  margin-top: 10px;
  height: 25px;
}
.link {
  margin-top: 2px;
  font-size: 12px;
  color: blue;
}
h2 {
  margin: 12px 0px;
}
</style>