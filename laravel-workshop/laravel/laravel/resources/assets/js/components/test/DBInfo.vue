<style scoped>
    div.panel > div.form-group {
        padding-top: 2rem;
    }
</style>
<template>
    <div>

        <button class="accordion" @click="accordion($event)">Database</button>
        <div class="panel">
            <!--loading effect-->
            <i  v-if="isLoading" class="fa fa-spinner fa-spin"></i>

            <!--load error effect-->
            <div v-if="errors.any()" v-text="tip.error" class="text-danger"></div>

            <div v-if="db" class="form-group">
                <div class="row">
                    <label class="col-lg-2">Type</label>
                    <div class="col-lg-10">{{ db.type }}</div>
                </div>

                <div class="row">
                    <label class="col-lg-2">Host</label>
                    <div class="col-lg-10">{{ db.host }}</div>
                </div>

                <div class="row">
                    <label class="col-lg-2">DB Name</label>
                    <div class="col-lg-10">{{ db.db }}</div>
                </div>

                <div class="row">
                    <label class="col-lg-2">User</label>
                    <div class="col-lg-10">{{ db.username }}</div>
                </div>

                <div class="row">
                    <label class="col-lg-2">Connect Test</label>
                    <div v-if="db.test!=='Connection failed'" class="col-lg-10 alert alert-success">{{ db.test }}</div>
                    <div v-else class="col-lg-10 alert alert-warning">{{ db.test }}</div>
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
                db: null,
                tip: {
                    error: '載入失敗，請確認routes/web.php有沒有將/data/info/db 打開'
                }
            }
        },
        mounted() {
            // (function($) {
            //     require('../../../../../public/js/home/demo.js');
            // })(jQuery);

            axios.get(this.api.get("testGetDBInfo"))
                .then( response=>this.db=response.data,this.isLoading=false )
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
