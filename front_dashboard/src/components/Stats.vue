<template>
  <div
    className="p-4 space-y-2 flex flex-col justify-center items-center mb-20"
  >
    <div class="flex flex-row w-max">
      <div class="pr-3">Search :</div>
      <input type="text" class="pl-2 text-black" v-model="studentInput" />
    </div>

    <div
      v-for="student in filtered"
      :key="student"
      class="w-full rounded-md p-2 mt-4"
      :class="`${student.check_in ? 'bg-green-800' : 'bg-gray-400'}`"
    >
      <div>Student ID: {{ student.student_id }}</div>
      <div>FirstName: {{ student.first_name }}</div>
      <div>LastName: {{ student.last_name }}</div>
      <div>NickName: {{ student.nick_name }}</div>
      <div>
        การถ่ายรูป: {{ student.photo_consent ? "อนุญาต" : "ไม่อนุญาต" }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../config";
export default {
  setup() {},
  async mounted() {
    const user = localStorage.getItem("user");
    const res = await axios(`${config.BACKEND}/api/kanokporn_swha/list`, {
      method: "POST",
      headers: {
        authorization: user,
      },
    });
    this.itv = setInterval(async () => {
      try {
        const res = await axios(`${config.BACKEND}/api/kanokporn_swha/list`, {
          method: "POST",
          headers: {
            authorization: user,
          },
        });
        this.allStudent = res.data;
      } catch (error) {
        console.log(error);
      }
    }, 5000);
    this.allStudent = res.data;
    this.filtered = this.allStudent;
  },
  unmounted() {
    clearInterval(this.itv);
  },
  data() {
    return {
      studentInput: "",
      filtered: [],
      allStudent: {},
      itv: null,
    };
  },
  //   props: ["allStudent"],
  watch: {
    studentInput(n, o) {
      if (this.studentInput === "") {
        this.filtered = this.allStudent;
      } else {
        this.filterStudent();
      }
    },
    allStudent(n, o) {
      if (o !== n) {
        this.filterStudent();
      }
    },
  },
  methods: {
    filterStudent() {
      const regex = new RegExp(this.studentInput);

      this.filtered = this.allStudent.filter(
        (e) =>
          regex.test(e.student_id) ||
          regex.test(e.first_name) ||
          regex.test(e.last_name) ||
          regex.test(e.nick_name)
      );
    },
  },
};
</script>
