<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    // Các trường có thể được gán đại trà
    protected $fillable = [
        'title', 
        'total_duration',
    ];

    /**
     * Quan hệ One to Many với bảng Lessons
     */
    public function lessons()
    {
        return $this->hasMany(Lesson::class)->orderBy('lessons_order');
    }
}
