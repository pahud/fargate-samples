
class API{
    constructor() {
        this.version = "v1";
        this.path = "/videoplus/public";
        this.url = {
            test: this.path + "/test",
            internal: this.path + "/data",
            external: this.path + "/api"
        }
        this.url = {
            // testGetAppInfo:  this.url.test + "/data/info/app",
            // testGetDBInfo:  this.url.test + "/data/info/db",
            // testGetAWSInfo:  this.url.test + "/data/info/aws",
            // testGetAuthInfo: this.url.test + "/data/info/auth",

            testGetAppInfo: "./data/info/app",
            testGetDBInfo: "./data/info/db",
            testGetAWSInfo: "./data/info/aws",
            testGetAuthInfo:"./data/info/auth",

            testTouchS3: "./touch/s3",
            testLogin: "./login",

            getCredentialIdentity: this.url.internal + "/credential/self",
            getCredentialProgram: this.url.internal + "/credential/programs"
        };
    }


    get(field) {
        if( this.url[field] ) {
            return this.url[field];
        }else{
            return '404'
        }
    }

}

export default API;