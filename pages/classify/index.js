const App = getApp()

Page({
    data: {
        activeIndex: 0, 
        goods: {},
        classify: {},
        prompt: {
            hidden: !0,
        },
        toView:'',
        classifyheight:[]
    },
    onLoad() {
        this.classify = App.HttpResource('/classify/getClassifyList/:id', {id: '@id'})
        this.goods = App.HttpResource('/classify/getClassifyGood/:id', {id: '@id'})
        this.getSystemInfo();
        this.initClassify();
        this.initGoods();

       

 
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/goods/detail/index', {
            id: e.currentTarget.dataset.id
        })
    },
    initClassify() {
        var classifyitem ;
       // App.HttpService.getClassify({})
        const classify = this.data.classify
        const params = classify.params
        this.classify.queryAsync(params)
        .then(data => {
            console.log(data.classifyList);
            classifyitem = data.classifyList;
            
            this.setData({
                classify: {
                    items: classifyitem,
                    params: {
                        page : 1,
                        limit: 10,
                    },
                    paginate: {}
                }
            })
        })
    },
    initGoods() {
        var good ;
        const goods = this.data.goods
        const params = goods.params
//   App.HttpService.getClassifyGoods({})
        this.goods.queryAsync(params)
        .then(data => {
            console.log(data.goodList);
            good = data.goodList;
            var classifyheight = [];
            var beforelength = 0;
             for(var g in good){
                 let l = good[g].goodlist;
                 beforelength = beforelength+l.length;
                 classifyheight.push(beforelength*90+59);
            }

            this.setData({
                goods : {
                    items: good,
                    params: {
                        page : 1,
                        limit: 10,
                        
                    },
                    paginate: {}
                },
                'prompt.hidden': 1,
                classifyheight:classifyheight
            })
        })
    },
    changeTab(e) {
        console.log(e);
        const dataset = e.currentTarget.dataset
        const index = dataset.index
        const id = dataset.id
        console.log(id);
        this.setData({
            toView: 'id'+id,
            activeIndex:index
        })

    },
    scroll(e) {
        console.log(e);
        this.changeClassify(e.detail.scrollTop);
    },
    changeClassify(h) {
        const clist = this.data.classifyheight;
        console.log(clist);
        let f = 0;
        for(let i=0;i<clist.length;i++){
            if(clist[i]>h){
                f=i;
                break;
            }
        }
        this.setData({
            activeIndex:f
        })
    },
    getSystemInfo() {
        App.WxService.getSystemInfo()
        .then(data => {
            console.log(data)
            this.setData({
                deviceWidth: data.windowWidth, 
                deviceHeight: data.windowHeight, 
            })
        })
    },
})