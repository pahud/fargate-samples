<?php
/**
 * 登入用User ORM
 *
 * @version 0.1.0
 * @author ShengLung shenglung0619@gmail.com
 * @date 2017/11/27
 * @since 0.1.0 2017/11/27 description
 */
namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];
}
