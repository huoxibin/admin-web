# base-linkage  

## template

```Html
<base-linkage :dataMuilt="form.muiltselect" @getlevelVal="getlevelVal"></base-linkage>
```

## javaScript

```javaScript
/**
 *
 * @prop { object } dataMuilt 多选的三级的下拉菜单列表数据值 
 *      ex:（请将列表数据写成 如下形式）
 *        {name:'值',id:'值'}
 * 
 * @callback { function } 用于返回多选的值
 */

    export default {
        name: "Baselinkage",
        props: {
            dataMuilt:{
                type:Object,
                require:true
            }
        },
        watch:{
            'dataMuilt.firstList'(){
                this.data.firstList=this.dataMuilt.firstList;
            },
            'dataMuilt.secondList'(){
                this.data.secondList=this.dataMuilt.secondList;
            },
            'dataMuilt.threedList'(){
                this.data.threedList=this.dataMuilt.threedList;
            },
        },
        data(){
            return {
                data:{
                    firstList:[],
                    secondList:[],
                    threedList:[]
                },
                val:{
                    first:'',
                    second:'',
                    threed:''
                }
            }
        },
        methods:{
            getVal(fg){ //监控下拉的变化
                let obj=this;
                switch (fg) {
                    case 1:{
                        //清空二级和三级的下拉列表
                        obj.secondList=[];
                        obj.threedList=[];
                        //清空二级的选择项
                        obj.second='';
                        obj.threed='';
                    }break;
                    case 2:{
                        obj.threedList=[]; //清空三级的 列表内容
                        //清空三级的选择项
                        obj.threed='';
                    }break;
                    case 3:{}break;
                }
                this.$emit('getlevelVal',fg+1,this.val)
            },
        }
    }
```
