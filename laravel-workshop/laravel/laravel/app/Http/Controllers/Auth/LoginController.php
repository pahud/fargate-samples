<?php
/**
 * 登入用Controller
 *
 * @version 0.2.0
 * @author ShengLung shenglung0619@gmail.com
 * @date 2017/11/27
 * @since 0.1.0 2017/11/27 description
 * @since 0.2.0 2018/04/17 登出導向至母平台
 */
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;

/**
 * Class LoginController
 * @package App\Http\Controllers\Auth
 */
class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest', ['except' => 'logout']);
    }


    /**
     * 轉向admin
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function login(Request $request) {
        return redirect()->intended('/');
    }

    /**
     * 登出，並導向至母平台
     *
     * @return mixed
     */
    public function logout() {
    	Auth::logout();
    	return Redirect::to( "//".$_SERVER['HTTP_HOST']."/manage_login/login.php" );
    }
}
