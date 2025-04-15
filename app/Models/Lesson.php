<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    // Các trường có thể được gán đại trà
    protected $fillable = [
        'title', 
        'content', 
        'lessons_order',
        'course_id', // Khóa ngoại trỏ tới Course
    ];

    /**
     * Quan hệ Many to One với bảng Course
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
