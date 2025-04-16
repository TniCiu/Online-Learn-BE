<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;


class PublicController extends Controller
{
    /**
     * Upload an image to Cloudinary
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @param string $folder
     * @return string|null
     */
    public function uploadImage($file, $folder = 'default')
    {
        // Upload file lên Cloudinary
        try {
            $uploadResult = Cloudinary::upload($file->getRealPath(), [
                'folder' => $folder
            ]);

            // Trả về URL của ảnh đã upload
            return $uploadResult->getSecurePath();
        } catch (\Exception $e) {
            return null; // Trả về null nếu có lỗi trong quá trình upload
        }
    }


public function uploadFile(Request $request) 
{
    $file = $request->file('file');

        // Tạo tên file mới
        $filename = time() . '_' . $file->getClientOriginalName();

        // Lưu file vào thư mục public/uploads
        $path = $file->storeAs('uploads', $filename, 'public'); // Lưu vào public/uploads

        // Trả về URL công khai
        $url = asset('storage/uploads/' . $filename);  // Đảm bảo dùng 'storage' ở đây

        return response()->json([
            'data' => [
                'content' => [
                    'url' => $url,
                ]
            ]
        ], 201);
    
}

    
    
}
