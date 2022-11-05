<template>
	<div class="w-full rounded-md p-4">
		<div>Student ID: {{ studentData.student_id }}</div>
		<div>FirstName: {{ studentData.first_name }}</div>
		<div>LastName: {{ studentData.last_name }}</div>
		<div>NickName: {{ studentData.nick_name }}</div>
		<div>การถ่ายรูป: {{ studentData.photo_consent ? 'อนุญาต' : 'ไม่อนุญาต' }}</div>
	</div>
</template>

<script>
export default {
	props: ['studentData'],
	setup() {},
};
</script>
