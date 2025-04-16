<?php

namespace App\Services;

use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class CloudinaryService
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
}
