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
        <button class="accordion" @click="accordion($event)">Auth</button>
        <div class="panel">

            <!--loading effect-->
            <i  v-if="isLoading" class="fa fa-spinner fa-spin"></i>

            <!--load error effect-->
            <div v-if="errors.any()" v-text="tip.error" class="text-danger"></div>

            <div v-if="credential" class="form-group">
                <div class="row">
                    <label class="col-lg-2">User</label>
                    <div class="col-lg-10">{{ credential.user }}</div>
                </div>

                <div class="row">
                    <label class="col-lg-2">Session ID</label>
                    <div class="col-lg-10">{{ credential.sessionId }}</div>
                </div>

                <div class="row">
                    <label class="col-lg-2">expires</label>
                    <div v-if="credential.expires!==''" class="col-lg-10"> {{ expiresToDate }} ( {{ credential.expires }} )</div>
                </div>

                <div class="row">
                    <label class="col-lg-2">母平台</label>
                    <div class="col-lg-10 well">

                        <div class="form-group row">
                            <div class="col-lg-8">
                                <p>你可以按此登入母平台</p>

                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-lg-8 input-btn-pd">
                                <input v-model.trim="test.login.input" class="form-control" placeholder="請輸入使用者帳號">
                            </div>

                            <div class="col-lg-2 input-btn-pd">
                                <button @click="doLogin" type="button" class="btn">Login</button>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-lg-12">
                                <label>result：</label>
                                <i  v-if="test.login.isLoading" class="fa fa-spinner fa-spin"></i>
                                <label v-if="test.login.result">{{ test.login.result }}</label>
                                <label v-if="test.login.errors" class="text-danger">{{ test.login.errors.status }} {{ tip.login }}</label>
                            </div>
                        </div>

                    </div>




                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import ifvisible from "ifvisible";
    import moment from "moment";
    import API from "../../API";
    import Errors from "../../Errors";

    export default {

        data(){
            return {
                api: new API(),
                errors: new Errors(),
                isLoading: true,
                credential: null,
                test:{
                    login: {
                        input:'',
                        isLoading: false,
                        result: false,
                        errors:null,
                    }
                },
                tip: {
                    error: '載入失敗，請確認routes/web.php有沒有將/data/info/auth打開',
                    login: '請檢查是否有此使用者'
                },

            }
        },
        mounted() {
            // (function($) {
            //     require('../../../../../public/js/home/demo.js');
            // })(jQuery);


            this.setData()

            ifvisible.setIdleDuration(1800);

            // ifvisible.idle(()=>console.log("idle"));
            ifvisible.wakeup( () => this.setData() );
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
            doLogin: function() {
                var that = this;
                this.test.login.isLoading = true;
                this.test.login.result = null;
                axios.get(this.api.get("testLogin") + "/" + this.test.login.input)
                    .then( response => {
                        that.test.login.isLoading = false;
                        that.test.login.result = 'succ';
                        that.credential = response.data;
                    } )
                    .catch( errors => {
                        that.test.login.isLoading = false;
                        that.test.login.errors = errors.response;
                    } );
            },
            setData: function() {
                this.isLoading = true;
                axios.get(this.api.get("testGetAuthInfo"))
                    .then( response => {
                        this.credential = response.data;
                        this.isLoading = false;
                    } )
                    .catch( errors => {
                        this.errors.record(errors);
                        this.isLoading = false;
                    } );
            }

        },
        computed: {
            expiresToDate: function() {
                if(this.credential&&this.credential.expires) {
                    return moment(new Date(this.credential.expires*1000)).format("YYYY-MM-DD HH:mm:ss");
                }

                return "";
            }
        }
    }
</script>
