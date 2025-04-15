<?php

namespace App\Services;

use App\Models\Course;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class CourseService
{
    public function createCourse(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'thumbnail' => 'required|image|mimes:jpg,png,jpeg',
            'video' => 'required|file|mimetypes:video/mp4,video/mpeg',
            'description' => 'nullable|string',
            'author_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $thumbnailUrl = Cloudinary::upload($request->file('thumbnail')->getRealPath())->getSecurePath();


        // 3. Upload video lên Cloudinary
        $videoUrl = Cloudinary::uploadVideo($request->file('video')->getRealPath())->getSecurePath();

        $user = Auth::user();
        // 4. Tạo course
        $course = Course::create([
            'title' => $request->title,
            'description' => $request->description,
            'thumbnail' => $thumbnailUrl,
            'video' => $videoUrl,
            'author_id' => $user -> id,
            // set mặc định các field khác nếu cần
        ]);

        return response()->json([
            'message' => 'Course created successfully!',
            'data' => $course
        ], 201);
    }

    public function getAllCourses()
    {
        return Course::all();
    }

    public function getCourseById($id)
    {
        return Course::find($id);
    }

    public function updateCourse(Request $request, $id)
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'thumbnail' => 'sometimes|image|mimes:jpg,png,jpeg',
            'video' => 'sometimes|file|mimetypes:video/mp4,video/mpeg',
            'description' => 'nullable|string',
            'author_id' => 'sometimes|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('thumbnail')) {
            $course->thumbnail = Cloudinary::upload($request->file('thumbnail')->getRealPath())->getSecurePath();
        }

        if ($request->hasFile('video')) {
            $course->video = Cloudinary::uploadVideo($request->file('video')->getRealPath())->getSecurePath();
        }

        $course->update($request->only(['title', 'description', 'author_id']));

        return response()->json([
            'message' => 'Course updated successfully!',
            'data' => $course
        ]);
    }

    public function deleteCourse($id)
    {
        $course = Course::find($id);
        if (!$course) {
            return false;
        }

        $course->delete();
        return true;
    }

}
