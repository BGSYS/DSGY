import polyfill from 'assets/plugins/polyfill'
import WxValidate from 'helpers/WxValidate'
import HttpResource from 'helpers/HttpResource'
import HttpService from 'helpers/HttpService'
import WxService from 'helpers/WxService'
import Tools from 'helpers/Tools'
import Config from 'etc/config'

App({
	onLaunch() {
		console.log('onLaunch')
	},
	onShow() {
		console.log('onShow')
	},
	onHide() {
		console.log('onHide')
	},
	getUserInfo() {
		return this.WxService.login()
			.then(data => {
				console.log(data)
				return this.WxService.getUserInfo()
			})
			.then(data => {
				console.log(data)
				this.globalData.userInfo = data.userInfo
				return this.globalData.userInfo
			})
	},
	globalData: {
		userInfo: null,
		openid:'oSbkI0UDsjjXZj_Pr_-0EQJBAZBU'
	},
	renderImage(path) {
		if (!path) return ''
		if (path.indexOf('http') !== -1) return path
		if (path.indexOf('user') > -1) {
			return `${this.Config.selfBasePath}${path}`
		} else {
			return `${this.Config.fileBasePath}${path}`
		}
	},
	loginin: function () {
		var that = this;
		wx.login({
			success: function (res) {
				if (res.code) {
					wx.request({
						url: 'https://api.weixin.qq.com/sns/jscode2session',
						data: {
							appid: 'wxa15885033008e6b3',
							js_code: res.code,
							secret: 'b5eb4843ff2ae0e005853ac04ecb5e48',
							grant_type: 'authorization_code'
						},
						success: function (res) {
							var open = res.data.openid;
							that.globalData.openid = res.data.openid;
						},
					});
				} else {
					console.log('获取用户登录态失败！' + res.errMsg)
				}
			}
		});
	},
	WxValidate: (rules, messages) => new WxValidate(rules, messages),
	HttpResource: (url, paramDefaults, actions, options) => new HttpResource(url, paramDefaults, actions, options).init(),
	HttpService: new HttpService,
	WxService: new WxService,
	Tools: new Tools,
	Config: Config,
})