<style scoped>
    div.panel > div.form-group {
        padding-top: 2rem;
    }
</style>
<template>
    <div>
        <button class="accordion" @click="accordion($event)">Basic</button>
        <div class="panel">

            <!--loading effect-->
            <i  v-if="isLoading" class="fa fa-spinner fa-spin"></i>

            <!--load error effect-->
            <div v-if="errors.any()" v-text="tip.error" class="text-danger"></div>

            <div v-if="app" class="form-group">
                <div class="row">
                    <label class="col-lg-2">Name</label>
                    <div class="col-lg-10">{{ app.name }}</div>
                </div>

                <div class="row">
                    <label class="col-lg-2">Env</label>
                    <div class="col-lg-10">{{ app.env }}</div>
                </div>
                <div class="row">
                    <label class="col-lg-2">Debug</label>
                    <div class="col-lg-10">{{ app.debug }}</div>
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
                app: null,
                tip: {
                    error: '載入失敗，請確認routes/web.php有沒有將/data/info/app打開'
                }
            }
        },
        mounted() {
            // (function($) {
            //     require('../../../../../public/js/home/demo.js');
            // })(jQuery);

            axios.get(this.api.get("testGetAppInfo"))
                .then( response=>this.app=response.data,this.isLoading=false )
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
            }
        }
    }
</script>
