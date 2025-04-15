<?php

namespace App\Http\Controllers;

use App\Services\CourseService;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    protected $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    // Create a new course
    public function store(Request $request)
    {
        $course = $this->courseService->createCourse($request);
        return response()->json($course, 201);
    }

    // Get all courses
    public function index()
    {
        $courses = $this->courseService->getAllCourses();
        return response()->json($courses, 200);
    }

    // Get a single course by ID
    public function show($id)
    {
        $course = $this->courseService->getCourseById($id);
        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }
        return response()->json($course, 200);
    }

    // Update an existing course
    public function update(Request $request, $id)
    {
        $course = $this->courseService->updateCourse($request, $id);
        return response()->json($course, 200);
    }

    // Delete a course
    public function destroy($id)
    {
        $deleted = $this->courseService->deleteCourse($id);
        if (!$deleted) {
            return response()->json(['message' => 'Course not found'], 404);
        }
        return response()->json(['message' => 'Course deleted successfully'], 200);
    }
}
