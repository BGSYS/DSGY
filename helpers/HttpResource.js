import __config from '../etc/config'
import WxResource from 'WxResource'

class HttpResource {
	constructor(url, paramDefaults, actions, options) {
		Object.assign(this, {
			url, 
			paramDefaults, 
			actions, 
			options, 
		})
	}

	/**
	 * 返回实例对象
	 */
	init() {
		const resource = new WxResource(this.setUrl(this.url), this.paramDefaults, this.actions, this.options)
		resource.setDefaults({
			interceptors: this.setInterceptors()
		})
		return resource
	}

	/**
	 * 设置请求路径
	 */
	setUrl(url) {

        if(url.indexOf('goodsInfo')!=-1||(url.indexOf('address')!=-1)){
            return `${__config.selfPath}${url}`
        }


		return `${__config.basePath}${url}`
	}

	/**
	 * 拦截器
	 */
	setInterceptors() {
		return [{
            request: (request) => {
                request.header = request.header || {}
                request.requestTimestamp = new Date().getTime()
                if ((request.url.indexOf('/api') !== -1||request.url.indexOf('/a/') !== -1) && wx.getStorageSync('token')) {
                    if(request.method=="GET"){
                        request.header.Authorization = 'Bearer ' + wx.getStorageSync('token');
                    }else{
                        request.header={"Content-Type": "application/x-www-form-urlencoded"};
                    }                     
                }
                wx.showToast({
                    title: '加载中', 
                    icon: 'loading', 
                    duration: 10000, 
                    mask: !0, 
                })
                return request
            },
            requestError: (requestError) => {
                wx.hideToast()
                return requestError
            },
            response: (response) => {
                response.responseTimestamp = new Date().getTime()
                if(response.statusCode === 401) {
                    wx.removeStorageSync('token')
                    wx.redirectTo({
                        url: '/pages/login/index'
                    })
                }
                wx.hideToast()
                return response
            },
            responseError: (responseError) => {
                wx.hideToast()
                return responseError
            },
        }]
	}
}

export default HttpResource