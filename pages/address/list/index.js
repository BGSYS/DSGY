const App = getApp()

Page({
    data: {
        address: {},
        prompt: {
            hidden: !0,
            icon: '../../../assets/images/iconfont-addr-empty.png',
            title: '还没有收货地址呢',
            text: '暂时没有相关数据',
        },
    },
    onLoad() {
        this.address = App.HttpResource('/address/:id', {id: 'myaddress'} );
        this.addresswx = App.HttpResource('/address/add');
        this.addressDefalut = App.HttpResource('/address/addressflag');
        ///address/:id',myaddress/:userId{userId:'oSbkI0UDsjjXZj_Pr_-0EQJBAZB'})
        this.onPullDownRefresh()
    },
    initData() {
        this.setData({
            address: {
                items: [],
                params: {
                    // page : 1,
                    // limit: 10,
                    openId:App.globalData.openid,
                },
                paginate: {}
            },
        })
    },
    toAddressEdit(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/address/edit/index', {
            id: e.currentTarget.dataset.id
        })
    },
    toAddressAdd(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/address/add/index')
    },
    toAddWXAdd(e) {
        console.log(e);
        const params ={};// e.detail.value
        App.WxService.chooseAddress()
	    .then(data => {
	        console.log(data);
            params.city=data.cityName;
            params.county=data.countyName;
            params.openid=App.globalData.openid;
            params.province=data.provinceName;
            params.receiverdetailed=data.detailInfo;
            params.receivername=data.userName;
            params.receiverphone=data.telNumber;
            params.userflag=0;
            params.addressflag=1;
            params.receiverzone=data.countyName;
	        // this.setData({});
            console.log(params);
            // App.HttpService.postAddress(params)
            this.addresswx.saveAsync(params)
            .then(data => {
                console.log(data)
                if (data.addressid) {
                    this.showToast("新增成功")
                }
            });
        // App.WxService.navigateTo('/pages/address/addwx/index')
	    });		
    },
    showToast(message) {
		App.WxService.showToast({
			title   : message, 
			icon    : 'success', 
			duration: 1500, 
		})
		// .then(() => App.WxService.navigateBack())
	},
    setDefalutAddress(e) {
        const params = this.data.address.params;
        const id = e.currentTarget.dataset.id;
        params.addidnew=id;
        //App.HttpService.setDefalutAddress(id)
        this.addressDefalut.saveAsync(params)
        .then(data => {
            console.log(data);
            this.onPullDownRefresh();
            // if (data.meta.code == 0) {
            //     this.onPullDownRefresh()
            // }
        })
    },
    getList() {
        const address = this.data.address
        const params = address.params

        // App.HttpService.getAddressList(params)
        this.address.queryAsync(params)
        .then(data => {
            console.log(data)
            if (data.length >0) {
                address.items = [...address.items, ...data]//.data.items
                //address.paginate = data.data.paginate
                //address.params.page = data.data.paginate.next
                //address.params.limit = data.data.paginate.perPage
                this.setData({
                    address: address,
                    'prompt.hidden': address.items.length,
                })
            }
        })
    },
    onPullDownRefresh() {
        // console.info('onPullDownRefresh')
        this.initData()
        this.getList()
    },
    onReachBottom() {
        console.info('onReachBottom')
        if (!this.data.address.paginate.hasNext) return
        this.getList()
    },
})