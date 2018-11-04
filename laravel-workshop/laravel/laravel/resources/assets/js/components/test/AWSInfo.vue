<style scoped>
    div.panel > div.form-group {
        padding-top: 2rem;
    }

    div.input-btn-pd {
        padding: 5px;
    }
</style>
<template>
    <div>

        <button class="accordion" @click="accordion($event)">AWS</button>
        <div class="panel">

            <!--loading effect-->
            <i  v-if="isLoading" class="fa fa-spinner fa-spin"></i>

            <!--load error effect-->
            <div v-if="errors.any()" v-text="tip.error" class="text-danger"></div>

            <div v-if="aws" class="form-group">

                <div class="row">
                    <label class="col-lg-2">S3 Region</label>
                    <div class="col-lg-10"> {{ aws.s3.region }} </div>
                </div>

                <div class="row">
                    <label class="col-lg-2">S3 Bucket</label>
                    <div class="col-lg-10"> {{ aws.s3.bucket }} </div>
                </div>

                <div class="row">
                    <label class="col-lg-2">S3 Test</label>
                    <div class="col-lg-10">

                        <div class="well col-lg-12">
                            <div class="form-group row">
                                <div class="col-lg-8">
                                    <p>你可以發送一段文字，並且送至S3</p>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-lg-8 input-btn-pd">
                                    <input v-model.trim="test.s3.input" class="form-control" maxlength="10" placeholder="最多可輸入10個字">
                                </div>

                                <div class="col-lg-2 input-btn-pd">
                                    <button @click="sendTextToS3" type="button" class="btn">Send Text</button>
                                </div>
                            </div>

                            <div class="form-group row">
                                <div class="col-lg-12">
                                    <label>result：</label>
                                    <i  v-if="test.s3.isLoading" class="fa fa-spinner fa-spin"></i>
                                    <label v-if="test.s3.result">{{ test.s3.result }}</label>
                                    <label v-if="test.s3.errors" class="text-danger">{{ test.s3.errors.status }} {{ tip.s3 }}</label>
                                </div>
                                <div class="col-lg-12">
                                    <label>url：</label>
                                    <label v-if="test.s3.data">{{ test.s3.data.url }}</label>
                                </div>

                                <div class="col-lg-12">
                                    <label>text：</label>
                                    <label v-if="test.s3.data">{{ test.s3.data.text }}</label>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import API from "../../API";
    import Errors from "../../Errors";

    export default {

        data(){
            return {
                api: new API(),
                errors: new Errors(),
                isLoading: true,
                aws: null,
                test:{

                    s3: {
                        input:"",
                        isLoading: false,
                        result: false,
                        errors:null,
                        data:null
                    }
                },
                tip: {
                    s3: "發送失敗，請檢查AWS設置",
                    error: '載入失敗，請確認routes/web.php有沒有將/data/info/aws 打開'
                }
            }
        },
        mounted() {
            // (function($) {
            //     require('../../../../../public/js/home/demo.js');
            // })(jQuery);

            axios.get(this.api.get("testGetAWSInfo"))
                .then( response=>this.aws=response.data,this.isLoading=false )
                .catch( errors=>this.errors.record(errors) );

        },
        methods: {
            accordion: function() {
                event.target.classList.toggle("active");
                var panel = event.target.nextElementSibling;
                if (panel.style.maxHeight){
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            },
            sendTextToS3 : function(){
                if(this.test.s3.input!=="") {
                    var that = this;
                    this.test.s3.isLoading = true;
                    this.test.s3.result = null;
                    this.test.s3.data = null;
                    axios.get(this.api.get("testTouchS3") + "/" + this.test.s3.input)
                        .then(response => {
                            that.test.s3.isLoading = false;
                            that.test.s3.result = 'succ';
                            that.test.s3.data = response.data;
                        })
                        .catch(errors => {
                            that.test.s3.isLoading = false
                            that.test.s3.errors = errors.response;
                        });
                }else{
                    alert("請輸入文字");
                }
            }
        }
    }
</script>
