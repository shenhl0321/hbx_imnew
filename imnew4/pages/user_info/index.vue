<template>
	<view style="font-size: 14px;padding:20px">
		{{text}}
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 1,
				type1: 'CVC TEAM rất coi trọng việc bảo mật thông tin cá nhân của bạn. Chúng tôi sẽ tuân thủ nghiêm ngặt pháp luật và các quy định để cung cấp cho bạn các dịch vụ an toàn và đáng tin cậy hơn. Phần tóm tắt sau đây có thể giúp bạn có cái nhìn tổng quan trực quan và ngắn gọn hơn về nội dung Nguyên tắc bảo vệ quyền riêng tư của WeChat',
				type2: ' Nếu bạn dưới 18 tuổi, vui lòng đọc thỏa thuận này và các thỏa thuận khác nêu trên kèm theo người giám hộ hợp pháp và đặc biệt chú ý đến các điều khoản sử dụng dành cho trẻ vị thành niên. Đặc biệt, nếu bạn là trẻ em dưới 14 tuổi, bạn cũng nên yêu cầu người giám hộ đọc kỹ "Tuyên bố bảo vệ quyền riêng tư của trẻ em" do Tencent đặc biệt xây dựng trước khi hoàn tất đăng ký tài khoản. Trẻ em dưới 14 tuổi chỉ có thể sử dụng dịch vụ sau khi có được sự đồng ý của người giám hộ đối với "Tuyên bố bảo vệ quyền riêng tư của trẻ em".',
				type3: 'CVC TEAM là dịch vụ mạng xã hội được cung cấp bởi Công ty TNHH Hệ thống máy tính Tencent Thâm Quyến (được đăng ký tại tầng 35 của Tòa nhà Khoa học và Công nghệ Zhongyi Road, Cộng đồng Maling, Phố Yuehai, Phố Yuehai, Quận Nanshan, Thâm Quyến. Sau đây cũng gọi tắt là là sản phẩm "chúng tôi" hoặc "CVC TEAM") ("CVC TEAM" trong hướng dẫn này là một sản phẩm khác với phiên bản hoạt động ở nước ngoài, tức là "CVC TEAM". Người dùng CVC TEAM được phân biệt bằng số điện thoại di động. những người đăng ký qua số điện thoại di động ở Trung Quốc đại lục là người dùng CVC TEAM và những người còn lại là người dùng Be a CVC TEAM. Các hoạt động xử lý và bảo vệ thông tin cá nhân liên quan đến hướng dẫn này là dành cho các sản phẩm CVC TEAM). Để giải thích cách CVC TEAM thu thập, sử dụng và lưu trữ thông tin cá nhân của bạn cũng như những quyền mà bạn có',
				text: ''
			}
		},
		onLoad(options) {
			this.type = options.type
			if (this.type == 1) {
				this.text = this.type1
			}
			if (this.type == 2) {
				this.text = this.type2
			}
			if (this.type == 3) {
				this.text = this.type3
			}
		},
		methods: {

		},
	}
</script>

<style>
</style>