const App = getApp()
var tcity = require("../../../utils/citys.js");
const app=getApp();
Page({
    data: {
    	show: !0,		
    	form: {
				receivername   : '', 
				gender : 'male', 
				receiverphone    : '', 
				receiverdetailed: '', 
				userflag : 1, //is_def : !1,
				openid:'',
				
      },
			provinces: [],
				province: "",
				citys: [],
				city: "",
				countys: [],
				county: '',
				value: [0, 0, 0],
				values: [0, 0, 0],
				condition: false,
      radio: [
            {
            	name: '先生', 
            	value: 'male', 
            	checked: !0, 
            },
            {
            	name: '女士', 
            	value: 'female', 
            },
      ],			
    },
    onLoad() {
    	this.WxValidate = App.WxValidate({
			receivername: {
				required: true, 
				minlength: 2, 
				maxlength: 10, 
			},
			receiverphone: {
				required: true, 
				tel: true, 
			},
			receiverdetailed: {
				required: true, 
				minlength: 2, 
				maxlength: 100, 
			},
		}, {
			receivername: {
				required: '请输入收货人姓名', 
			},
			receiverphone: {
				required: '请输入收货人电话', 
			},
			receiverdetailed: {
				required: '请输入收货详细人地址', 
			},
		})
    this.address = App.HttpResource('/address/add');//, {id: 'add'});	
		//this.address = App.HttpResource('/address/:id', {id: 'add'});		
		console.log("onLoad");
		var that = this;
		
		tcity.init(that);

		var cityData = that.data.cityData;
		const openid=App.globalData.openid;
		
		const provinces = [];
		const citys = [];
		const countys = [];

		for(let i=0;i<cityData.length;i++){
		provinces.push(cityData[i].name);
		}
		console.log('省份完成');
		for (let i = 0 ; i < cityData[0].sub.length; i++) {
		citys.push(cityData[0].sub[i].name)
		}
		console.log('city完成');
		for (let i = 0 ; i < cityData[0].sub[0].sub.length; i++) {
		countys.push(cityData[0].sub[0].sub[i].name)
		}
		
		that.setData({
			'provinces': provinces,
			'citys':citys,
			'countys':countys,
			'province':cityData[0].name,
			'city':cityData[0].sub[0].name,
			'county':cityData[0].sub[0].sub[0].name,
			'form.openid':openid,
		})
		console.log('初始化完成');
		


    },
	bindPickerChange: function(e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		this.setData({
		index: e.detail.value
		})
	},
	radioChange(e) {		 
		console.log('radio发生change事件，携带value值为：', e.detail.value)
		const params = e.detail.value
		const value = e.detail.value
		const radio = this.data.radio
		radio.forEach(n => n.checked = n.value === value)
		this.setData({
			radio: radio, 
			'form.gender': value, 
		})
	},
	submitForm(e) {
		const params = e.detail.value

		console.log(params)

		if (!this.WxValidate.checkForm(e)) {
			const error = this.WxValidate.errorList[0]
			App.WxService.showModal({
				title: '友情提示', 
					content: `${error.param} : ${error.msg}`, 
					showCancel: !1, 
			})
			return false
		}

		// App.HttpService.postAddress(params)
		this.address.saveAsync(params)
		.then(data => {
			console.log(data)
			if (data.addressid) {
				this.showToast("新增成功")
			}
		})
	},
	showToast(message) {
		App.WxService.showToast({
			title   : message, 
			icon    : 'success', 
			duration: 1500, 
		})
		.then(() => App.WxService.navigateBack())
	},
	chooseLocation() {
		App.WxService.chooseLocation()
	    .then(data => {
	        console.log(data);
					var n='区';
					if(data.address.indexOf('县')!=-1){
						n='县';
					}
	        this.setData({
						'province': data.address.substring(0,data.address.indexOf('省')+1),
	        	'city': data.address.substring(data.address.indexOf('省')+1,data.address.indexOf('市')+1),
						'county': data.address.substring(data.address.indexOf('市')+1,data.address.indexOf(n)+1),
						'form.receiverdetailed': data.address.substring(data.address.indexOf(n)+1,)+" "+data.name,
	        })
	    })
	},
	bindChange: function(e) {
    console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;
    
    if(val[0] != t[0]){
      console.log('province no ');
      const citys = [];
      const countys = [];

      for (let i = 0 ; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0 ; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        'province': this.data.provinces[val[0]],
        'city': cityData[val[0]].sub[0].name,
        'citys':citys,
        'county': cityData[val[0]].sub[0].sub[0].name,
        'countys':countys,
        'values': val,
        'value':[val[0],0,0]
      })
      
      return;
    }
    if(val[1] != t[1]){
      console.log('city no');
      const countys = [];

      for (let i = 0 ; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }
      
      this.setData({
        'city': this.data.citys[val[1]],
        'county': cityData[val[0]].sub[val[1]].sub[0].name,
        'countys':countys,
        'values': val,
        'value':[val[0],val[1],0]
      })
      return;
    }
    if(val[2] != t[2]){
      console.log('county no');
      this.setData({
        'county': this.data.countys[val[2]],
        'values': val
      })
      return;
    }  

  },
  open:function(){
    this.setData({
      'condition':!this.data.condition,
    })
  },

})