export default {
    methods: {
        //获取分类Id
        getCategoryId({ categoryId, leve }) {
            console.log("这是父组件", categoryId, leve);
            switch (leve) {
                case 1:
                    this.category1Id = categoryId;
                    this.category2Id = "";
                    this.category3Id = "";
                    break;

                case 2:
                    this.category2Id = categoryId;
                    this.category3Id = "";
                    break;

                case 3:
                    this.category3Id = categoryId;
                    console.log(this);
                    this.getAttrList();
                    break;

                default:
                    break;
            }
        },
    },
}