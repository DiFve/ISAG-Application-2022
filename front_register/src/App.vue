<template data-theme="halloween">
	<div class="flex flex-col items-center bg-[url('/bg.jpg')] bg-cover animate-fade-in min-h-screen">
		<!-- <img :src="getBackgroundURL()" /> -->
		<!-- Header -->
		<div
			class="text-center mb-8 mt-8 text-3xl text-accent uppercase font-bold select-none neonText"
		>
			ISAG - Secure First #7
		</div>
		<!-- End Of Header -->
		<div class="flex justify-item-center flex-col">
			<!-- Header -->
			<div class="bg-white w-full h-12 rounded-t-md">
				<!-- Button Group -->
				<div class="flex items-center h-full ml-4 justify-between">
					<div class="space-x-2 flex">
						<div
							class="rounded-full w-4 h-4"
							v-bind:style="{ 'background-color': '#ff6058' }"
						></div>
						<div
							class="rounded-full w-4 h-4"
							v-bind:style="{ 'background-color': '#FFBC2E' }"
						></div>
						<div
							class="rounded-full w-4 h-4"
							v-bind:style="{ 'background-color': '#29C940' }"
						></div>
					</div>

					<div class="select-none" v-if="!ticketSoldOut()">
						<div class="animate-pulse text-black font-bold mr-4">
							tickets: {{ ticketLeft || -1 }} left
						</div>
					</div>
				</div>

				<!-- End Of Button Group -->
			</div>
			<!-- End Of Header -->
			<!-- Your Input -->
			<div
				v-bind:style="{ 'background-color': '#14191e' }"
				class="flex justify-item-center p-4 flex-col rounded-md"
			>
				<div v-if="ticketSoldOut()" class="w-96 text-center">
					All available seats have been taken.
				</div>
				<!-- StudentId -->
				<div
					v-if="!ticketSoldOut() && showQR !== true"
					class="space-y-4 flex flex-col justify-item-center"
				>
					<div class="w-full flex justify-around items-center mt-4">
						<div class="w-1/5 text-center select-none">รหัสนักศึกษา</div>
						<input
							type="text"
							placeholder="6501XXXX"
							class="input w-3/5 outline-none"
							v-model="studentId"
							required="true"
						/>
					</div>
					<!-- End Of StudentId -->
					<!-- FirstName -->
					<div class="w-full flex justify-around items-center">
						<div class="w-1/5 text-center select-none">ชื่อจริง</div>
						<input
							type="text"
							placeholder="ใส่ชื่อจริง (ภาษาไทย)"
							class="input w-3/5 outline-none"
							required="true"
							v-model="firstName"
						/>
					</div>
					<!-- End Of FirstName -->
					<!-- FirstName -->
					<div class="w-full flex justify-around items-center">
						<div class="w-1/5 text-center select-none">นามสกุล</div>
						<input
							type="text"
							placeholder="ใส่นามสกุล (ภาษาไทย)"
							class="input w-3/5 outline-none"
							v-model="lastName"
							required="true"
						/>
					</div>
					<!-- End Of FirstName -->
					<!-- NickName -->
					<div class="w-full flex justify-around items-center">
						<div class="w-1/5 text-center select-none">ชื่อเล่น</div>
						<input
							type="text"
							placeholder="ใส่กับกูปะล่ะ"
							class="input w-3/5 outline-none"
							v-model="nickName"
							required="true"
						/>
					</div>
					<!-- End Of NickName -->
					<div class="w-full flex justify-around items-center pt-8">
						<!-- Data Consent -->
						<div class="">
							<label class="label cursor-pointer">
								<input
									type="checkbox"
									class="checkbox checkbox-primary"
									v-model="dataConsentCheck"
								/>
								<span class="label-text ml-2 select-none">อนุญาติให้ผู้จัดงานนำข้อมูลไปใช้งาน</span>
							</label>
						</div>
						<!-- End Of Data Consent -->
						<!-- Photo Consent -->
						<div class="">
							<label class="label cursor-pointer">
								<input
									type="checkbox"
									class="checkbox checkbox-primary"
									v-model="photoConsentCheck"
								/>
								<span class="label-text ml-2 select-none"
									>อนุญาติให้ผู้จัดงานบันทึกรูปของท่านภายในงาน</span
								>
							</label>
						</div>
						<!-- End Of Photo Consent -->
					</div>

					<!-- HCaptcha -->
					<div class="flex justify-center p-4">
						<vue-hcaptcha
							sitekey="aaaaaaaa-0000-0000-0000-aaaaaaaaaaaa"
							@verify="onVerify"
							@expired="onExpire"
							@challenge-expired="onChallengeExpire"
							@error="onError"
						></vue-hcaptcha>
					</div>
					<!-- End Of HCaptcha -->
					<div class="w-full flex justify-center items-center pt-8 pb-8">
						<button
							class="btn btn-primary w-80 text-white"
							:disabled="!canSubmit()"
							@click="submit"
						>
							Register
						</button>
					</div>

					<label
						class="text-sm items-center text-center underline cursor-pointer select-none"
						for="modal-consent"
					>
						การนำข้อมูลไปใช้งาน
					</label>
				</div>
				<!-- Response Zone -->
				<div v-if="showQR === true" class="w-full flex flex-col justify-around items-center">
					<div class="pt-2 select-none">
						จงเก็บสิ่งนี้ไว้เพื่อเข้างาน (Please Take a Screenshot.)
					</div>
					<div class="mt-2 bg-white h-64 w-64 flex justify-center items-center">
						<qrcode-vue
							:value="value"
							:size="size"
							level="H"
							class="pt-2"
							background="#ffffff"
							foreground="#000000"
						></qrcode-vue>
					</div>

					<div class="pt-2 select-none">และจงใช้ข้างล่างนี้ยืนยันตัวตนกับยามตรวจบัตร</div>
					<div class="p-4 text-primary flex flex-row">
						<p ref="copy">
							{{ timeStamp }}
						</p>
						<i
							class="mdi text-white cursor-pointer ml-4"
							:class="`${isCopy ? 'mdi-checkbox-marked-outline' : 'mdi-content-copy'}`"
							@click="copy"
						>
						</i>
					</div>
					<div class="pt-2 select-none">เข้าร่วมกลุ่มเพื่อรับข่าวสารต่าง ๆ ของงานในครั้งนี้</div>
					<iframe
						src="https://canary.discord.com/widget?id=__edit__me__&theme=dark"
						width="350"
						height="400"
						allowtransparency="true"
						frameborder="0"
						sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
					></iframe>
				</div>
				<!-- End Of Response Zone -->
			</div>
			<!-- End Of User Input -->
		</div>

		<!-- Modal -->
		<input type="checkbox" id="modal-consent" class="modal-toggle" />
		<div class="modal">
			<div class="modal-box select-none">
				<p class="py-4">
					การนำข้อมูลไปใช้งาน: ข้อมูลของท่านประกอบไปด้วยรหัสนักศึกษา, ชื่อจริง, นามสกุล, ชื่อเล่น
					ข้อมูลส่วนนี้จะใช้ในการลงทะเบียนเพื่อเข้าร่วมงานเท่านั้นและจะมีการเก็บรักษาข้อมูลของท่านไว้เป็นเวลา
					180 วันหลังจากนั้นจะมีการลบข้อมูลดังกล่าวทิ้ง
				</p>
				<p class="py-4">
					รูปถ่ายภายในงาน: ภายในงานจะมีการบันทึกภาพเก็บเอาไว้
					รูปถ่ายภายในงานจะถูกนำไปใช้ในการประชาสัมพันธ์กิจกรรมต่าง ๆ ภายในแล็บ
					ทางห้องแล็บขออนุญาตินำรูปดังกล่าวไปใช้โดยไม่มีการขอซ้ำอีกครั้ง
				</p>
				<div class="modal-action">
					<label for="modal-consent" class="btn">ปิด</label>
				</div>
			</div>
		</div>
		<!-- End Of Modal -->
		<Footer></Footer>
	</div>
	<!-- <Footer /> -->
</template>

<script>
import Footer from './components/Footer.vue';
import axios from 'axios';
import QrcodeVue from 'qrcode.vue';
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
import useClipboard from 'vue-clipboard3';
import config from './config';

export default {
	components: { Footer, QrcodeVue, VueHcaptcha },
	setup() {},
	data() {
		return {
			ticketLeft: 60,
			studentId: '',
			firstName: '',
			lastName: '',
			nickName: '',
			dataConsentCheck: false,
			photoConsentCheck: false,
			dataConsent: 0,
			photoConsent: 0,
			showQR: false,
			timeStamp: 'Error !, Please Contact ISAG Lab.',
			value: '',
			size: '200',
			level: 'H',
			verifyToken: '', // อันนี้ใช้ส่งไป backend เพื่อทำการ verify
			eToken: '', // อันนี้ไม่ได้ใช้แต่ดึงออกมาด้วยเฉย ๆ
			itv: null,
			isCopy: false, // เอาไว้เปลี่ยน icon จาก copy -> mask
		};
	},
	async mounted() {
		await this.getTicketLeft();

		// ใช้ interval มาช่วยในการดึง จะได้สมูทมากขึ้น
		// itv = interval
		this.itv = setInterval(async () => {
			await this.getTicketLeft();
		}, 5000);
	},
	unmounted() {
		// ตอนปิดให้ Clear interval ทิ้งด้วย
		clearInterval(this.itv);
	},
	methods: {
		// ใช้ฟังก์ชั่นเชค
		ticketSoldOut() {
			return this.ticketLeft <= 0;
		},
		async getTicketLeft() {
			try {
				const res = await axios(`${config.BACKEND}/api/v341/ticket-left`, {
					method: 'POST',
				});

				// ดึง ticketLeft ออกมาเลยจะได้ Clean ขึ้น
				this.ticketLeft = res.data?.ticketLeft;
				return res.data;
			} catch (error) {
				console.log(error);
			}
		},
		async submit() {
			if (this.dataConsentCheck == true) {
				this.dataConsent = 1;
			} else {
				this.dataConsent = 0;
			}

			if (this.photoConsentCheck == true) {
				this.photoConsent = 1;
			} else {
				this.photoConsent = 0;
			}

			if (
				this.studentId !== '' &&
				this.firstName !== '' &&
				this.lastName !== '' &&
				this.nickName !== '' &&
				this.verifyToken !== '' &&
				this.eToken !== ''
			) {
				// เติม await ไปด้วย
				await this.register();
				this.showQR = true;
				await this.getTimeStamp();
			}
		},
		canSubmit() {
			// function นี้เอาไว้ disable ปุ่มให้กดไม่ได้ จริง ๆ มันก็คล้าย ๆ กับที่เชคใน submit นั่นแหละไม่ต่างกัน
			return (
				this.dataConsentCheck &&
				this.studentId !== '' &&
				this.firstName !== '' &&
				this.lastName !== '' &&
				this.nickName !== '' &&
				this.verifyToken !== '' &&
				this.eToken !== ''
			);
		},
		async register() {
			try {
				const res = await axios(`${config.BACKEND}/api/v341/register`, {
					method: 'POST',
					data: {
						studentId: this.studentId,
						firstName: this.firstName,
						lastName: this.lastName,
						nickName: this.nickName,
						dataConsent: this.dataConsent,
						photoConsent: this.photoConsent,
						token: this.verifyToken, // ถ้าไม่มีอันนี้ backend จะ reject request ทิ้ง
					},
				});
				// ถ้าดึงค่าจากตัวแปลแนะนำให้ใช้ ? ใส่ไปด้วย
				this.value = res.data?.registerCode;
				return res.data;
			} catch (error) {
				console.log(error);
			}
		},
		async copy() {
			// Copy มาจาก Get Started เลย
			const { toClipboard } = useClipboard();

			try {
				await toClipboard(this.timeStamp);
				this.isCopy = true;
			} catch (e) {
				console.error(e);
			}
		},
		async getTimeStamp() {
			try {
				const res = await axios(`${config.BACKEND}/api/v341/timestamp`, {
					method: 'POST',
					data: {
						studentId: this.studentId,
					},
				});

				// ตอนนี้เป็น PREFIX:STUDENT-ID_HASHED-CODE
				// ใน QRCode กับ ที่แสดงจะเป็นคนละอันกัน
				// ใน QRCode จะเป็น PREFIX:STUDENT-ID:HASHED-CODE
				this.timeStamp = res.data?.timestamp;
				return res.data;
			} catch (error) {
				console.log(error);
			}
		},

		// Recaptcha
		onVerify(token, eKey) {
			// console.log('Verified: ', { token, eKey });
			this.verifyToken = token;
			this.eToken = eKey; // ไม่ได้ใช้ ดึงออกมาเล่น ๆ เดี๋ยวมันเหงา
		},
		onExpire: () => {
			// console.log('Token expired');
		},
		onChallengeExpire: () => {
			// console.log('Challenge expired');
		},
		onError: (err) => {
			// console.log('Error', err);
		},

		// Background Image
		getBackgroundURL() {
			return new URL(`./assets/bg.jpg`, import.meta.url).href;
		},
	},
};
</script>
