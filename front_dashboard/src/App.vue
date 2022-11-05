<template data-theme="halloween">
  <div v-if="isAuth">
    <QRCodeReaderVue
      @get-student="getStudent"
      @change-tab="changeTab"
      v-if="tab === 0"
    ></QRCodeReaderVue>
    <Details v-if="tab === 1" :studentData="this.studentData"></Details>
    <Stats v-if="tab === 2"></Stats>
    <Navigation @change-tab="changeTab" :tab="tab" />
  </div>
  <div v-else class="flex flex-col justify-center items-center h-screen p-4">
    <input class="w-full input input-primary" v-model="key" />
    <div class="btn btn-success mt-4" @click="login">Submit</div>
  </div>
</template>

<script>
import QRCodeReaderVue from "./components/QRCodeReader.vue";
import Details from "./components/Details.vue";
import Stats from "./components/Stats.vue";
import Navigation from "./components/Navigation.vue";
import axios from "axios";
import config from "./config";

export default {
  components: { QRCodeReaderVue, Navigation, Details, Stats },
  setup() {},
  data() {
    return {
      tab: 0,
      studentData: {},
      allStudentData: {},
      isAuth: false,
      key: "",
    };
  },
  async mounted() {
    try {
      const user = localStorage.getItem("user");
      const res = await axios(`${config.BACKEND}/api/kanokporn_swha/auth`, {
        method: "POST",
        headers: {
          authorization: user,
        },
      });
      console.log(res.data);
      this.isAuth = true;
    } catch (error) {
      console.log(error.response.data);
      localStorage.clear();
    }
  },
  methods: {
    login() {
      localStorage.setItem("user", this.key);
      window.location.reload();
    },
    changeTab(nextTab) {
      this.tab = nextTab;
    },
    getStudent(studentData) {
      this.studentData = studentData;
      console.log(this.studentData.student);
    },
    getAllStudent(student) {
      this.allStudentData = student;
      // console.log(this.allStudentData);
    },
  },
};
</script>
