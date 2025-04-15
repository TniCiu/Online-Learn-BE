<?php

namespace App\Http\Controllers;

use App\Services\CloudinaryService;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    protected $cloudinary;

    public function __construct(CloudinaryService $cloudinary)
    {
        $this->cloudinary = $cloudinary;
    }

    public function uploadFile(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,mp4,pdf|max:5120',
        ]);

        $uploadedUrl = $this->cloudinary->uploadImage($request->file('file'), 'public_files');

        return response()->json([
            'message' => 'Tải lên thành công!',
            'url' => $uploadedUrl,
        ]);
    }
}
