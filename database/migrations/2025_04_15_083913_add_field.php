<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->string('discount')->nullable();  // Cột discount
            $table->integer('total_duration')->nullable();  // Cột total_duration
            $table->integer('total_register')->nullable();  // Cột total_register
            $table->float('total_rating', 8, 2)->nullable();  // Cột total_rating
            $table->string('video')->nullable();  // Cột video
            $table->string('reason_reject')->nullable();  // Cột reason_reject
            $table->float('score_rating', 8, 2)->nullable();  // Cột score_rating
            $table->boolean('deleted')->default(false);  // Cột deleted
            $table->boolean('visible')->default(true);  // Cột visible
            $table->boolean('enable_q_a')->default(false);  // Cột enable_q_a
            $table->string('price')->nullable();  // Cột price
            $table->enum('status', ['active', 'inactive', 'pending'])->default('active');  // Cột status
            $table->text('description')->nullable();  // Cột description
            $table->string('thumbnail')->nullable();  // Cột thumbnail
            $table->unsignedBigInteger('author_id');  // Cột author_id (khóa ngoại từ bảng users)

            $table->foreign('author_id')->references('id')->on('users')->onDelete('cascade');  // Tạo khóa ngoại liên kết với bảng users
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropForeign(['author_id']);  // Xóa khóa ngoại
            $table->dropColumn([
                'discount', 
                'total_duration', 
                'total_register', 
                'total_rating', 
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
            ]);  // Xóa các cột thêm vào
        });
    }
};
