<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- CSRF Token --}}
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{--default favicon--}}
    <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon">

    {{-- font-awesome --}}
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet">

    <link rel="stylesheet" href="../css/app_test.css">

    <title>Project Info</title>

</head>
<body>
    <div id="app" class="container">
        <h1>開發環境資訊</h1>
        <p>看到此頁面代表 Laravel 啟動成功</p>
        <p>此頁面僅供檢查開發環境設定用，測試、正式環境會自動關閉</p>

        <basic-info></basic-info>
        <db-info></db-info>
        <aws-info></aws-info>
        <auth-info></auth-info>

    </div>
    <script src="../js/app_test.js"></script>
</body>
</html>