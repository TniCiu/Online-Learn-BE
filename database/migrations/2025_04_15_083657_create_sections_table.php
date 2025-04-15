<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSectionsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->id(); // Tạo trường id cho bảng sections
            $table->string('title'); // Tiêu đề của section
            $table->text('description')->nullable(); // Mô tả cho section, có thể null
            $table->integer('section_order'); // Thứ tự section trong khóa học
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade'); // Khóa ngoại liên kết với bảng courses, xóa theo khóa học
            $table->timestamps(); // Thêm created_at và updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sections'); // Xóa bảng sections khi rollback
    }
}
