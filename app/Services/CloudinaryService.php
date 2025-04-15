<?php
namespace App\Services;

use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
class CloudinaryService {
    /**
     * Upload image to Cloudinary and return secure URL.
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @param string|null $folder
     * @return string
     */
    public function uploadImage($file, $folder = null)
    {
        $uploadedFile = Cloudinary::upload($file->getRealPath(), [
            'folder' => $folder,
        ]);

        return $uploadedFile->getSecurePath(); // Trả về URL ảnh
    }
}
?>