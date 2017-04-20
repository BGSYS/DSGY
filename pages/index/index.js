const App = getApp()

Page({
    data: {
        activeIndex: 0,
        navList: [],
        indicatorDots: !0,
        autoplay: !1,
        current: 0,
        interval: 3000,
        duration: 1000,
        circular: !0,
        goods: {},
        prompt: {
            hidden: !0,
        },
    },
    swiperchange(e) {
        // console.log(e.detail.current)
    },
    onLoad() {
        this.banner = App.HttpResource('/goodsInfo/headImg');//, {id: '@id'}
        this.goods = App.HttpResource('/goodsInfo/findListByClassId')//'/classify/getClassifyGoodIndex'
        this.classify = App.HttpResource('/classify/getTypeClassifyList');

        this.getBanners()
        this.getClassify()
    },
    initData() {
        const goodsclassify = this.data.goods.params && this.data.goods.params.goodsclassify || ''
        const goods = {
            items: [],
            params: {
                // page : 1,
                // limit: 10,
                goodsclassify : goodsclassify,
            },
            paginate: {}
        }

        this.setData({
            goods: goods
        })
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/goods/detail/index', {
            id: e.currentTarget.dataset.id
        })
    },
    // search() {
    //     App.WxService.navigateTo('/pages/search/index')
    // },
    getBanners() {
    	// App.HttpService.getBanners({is_show: !0})
        this.banner.queryAsync()//{is_show: !0}
        .then(data => {
        	console.log(data)
        	if (data.headImgs.length > 0) {
                data.headImgs.forEach(n => n.path = App.renderImage(n.imgurl));
                console.log(data);
        		this.setData({
                    images: data.headImgs
                })
        	}
        })
    },
    getClassify() {
        const activeIndex = this.data.activeIndex;
        this.classify.queryAsync()
        .then(data => {
            console.log(data)
            if (data.classifyList.length> 0) {
                this.setData({
                    navList: data.classifyList,
                    'goods.params.goodsclassify': data.classifyList[activeIndex].classifyid
                })
                console.log(data.classifyList[activeIndex].classifyid);
                this.abc()
            }
            this.abc()
        })
    },
    getList() {
        // const activeIndex = this.data.activeIndex
        // var good ;
        const goods = this.data.goods
        const params = goods.params

        // App.HttpService.getGoods(params)
        this.goods.queryAsync(params)
        .then(data => {
            console.log(data)
            if (data.length> 0) {
                data.forEach(n => n.thumb_url = App.renderImage(n.goodsimg1));
                goods.items = [...goods.items, ...data];                
                this.setData({
                    goods: goods,
                    "goods.paginate.total":1,
                })
            }
            // if (data.goodList.length> 0) {
            //     data.goodList[activeIndex].goodlist.forEach(n => n.thumb_url = App.renderImage(n.goodspic));
            //     goods.items = [...goods.items, ...data.goodList[activeIndex].goodlist];                
            //     this.setData({
            //         goods: goods,
            //         "goods.paginate.total":1,
            //     })
            // }
        })
    },
    abc() {
        console.info('abc')
        this.initData()
        this.getList()
    },
    onReachBottom() {
        console.info('onReachBottom')
        if (!this.data.goods.paginate.hasNext) return
        this.getList()
    },
    onTapTag(e) {
        const goodsclassify = e.currentTarget.dataset.type
        const index = e.currentTarget.dataset.index
        const goods = {
            items: [],
            params: {
                // page : 1,
                // limit: 10,
                goodsclassify : goodsclassify,
            },
            paginate: {}
        }
        this.setData({
            activeIndex: index,
            goods: goods,
        })
        this.getList()
    },
    onShareAppMessage: function () {
        return {
        title: '自定义分享标题',
        path: '/pages/address/list/index',
        success: function(res) {
            // 分享成功
        },
        fail: function(res) {
            // 分享失败
        }
        }
    },
})
