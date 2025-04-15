<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'discount',
        'total_duration',
        'total_register',
        'total_rating',
        'title',
        'video',
        'reason_reject',
        'score_rating',
        'deleted',
        'visible',
        'enable_q_a',
        'price',
        'status',
        'description',
        'thumbnail',
        'author_id'
    ];

    protected $casts = [
        'deleted' => 'boolean',
        'visible' => 'boolean',
        'enable_q_a' => 'boolean',
        'price' => 'string', // enum kiểu string
        'status' => 'string', // enum kiểu string
    ];

    // One to Many: Course has many Ratings


    // Many to One: Course belongs to User
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    // One to Many: Course has many Sections
    public function sections()
    {
        return $this->hasMany(Section::class)->orderBy('section_order');
    }

    // Many to Many: Course belongs to many Categories
    public function categories()
    {
        // return $this->belongsToMany(Category::class);
    }
}
