<template>
  <div class="flex flex-col justify-center items-center">
    <p class="error">{{ error }}</p>

    <p class="decode-result">
      Last result: <b>{{ result }}</b>
    </p>

    <qrcode-stream
      @decode="onDecode"
      @init="onInit"
      :style="`width: 70%; height: 70%`"
    />
    <div class="mt-3">Register participant : {{ registeredParticipant }}</div>
  </div>
</template>

<script>
import { QrcodeStream } from "vue3-qrcode-reader";
import axios from "axios";
import config from "../config";

export default {
  components: { QrcodeStream },
  emits: ["get-student", "change-tab"],

  setup() {},
  data() {
    return {
      result: "",
      error: "",
      prefix: "ISAG_1ST_FIRST",
      registeredParticipant: 0,
      itv: null,
    };
  },
  async mounted() {
    await this.getRegisteredParticipant();
    this.itv = setInterval(async () => {
      await this.getRegisteredParticipant();
    }, 5000);
  },
  unmounted() {
    clearInterval(this.itv);
  },
  methods: {
    async onDecode(result) {
      this.result = result;
      const prefixQR = this.result.split(":");
      if (prefixQR[0] !== this.prefix) {
        console.log("Prefix not match");
        return;
      }
      const studentData = await this.fetchData(prefixQR[1]);
      this.$emit("getStudent", studentData);
      this.$emit("changeTab", 1);
    },

    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permission";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        } else if (error.name === "InsecureContextError") {
          this.error =
            "ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.";
        } else {
          this.error = `ERROR: Camera error (${error.name})`;
        }
      }
    },

    async fetchData(studentId) {
      try {
        const user = localStorage.getItem("user");
        const res = await axios(
          `${config.BACKEND}/api/kanokporn_swha/check-in`,
          {
            method: "POST",
            data: {
              studentId: studentId,
            },
            headers: {
              authorization: user,
            },
          }
        );
        // console.log(res.data);

        return res.data?.student;
      } catch (error) {
        console.log(error);
      }
    },

    async getRegisteredParticipant() {
      try {
        const user = localStorage.getItem("user");
        const res = await axios(
          `${config.BACKEND}/api/kanokporn_swha/register_participant`,
          {
            method: "GET",
            headers: {
              authorization: user,
            },
          }
        );

        this.registeredParticipant = res.data?.check_in;
        return res.data?.check_in;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
