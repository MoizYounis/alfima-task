<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $script_code
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class TrackingCode extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'script_code',
        'is_external',
        'placement',
        'is_active',
    ];

    protected $casts = [
        'is_external' => 'boolean',
        'is_active' => 'boolean',
    ];
}

