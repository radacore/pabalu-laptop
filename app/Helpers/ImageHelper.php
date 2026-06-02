<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ImageHelper
{
    /**
     * Compress and save an uploaded image as WebP.
     *
     * @return string The relative path to the saved file
     */
    public static function compressToWebp(UploadedFile $file, string $directory = 'laptop-photos', int $quality = 80): string
    {
        $sourceImage = match ($file->getClientOriginalExtension()) {
            'jpg', 'jpeg' => imagecreatefromjpeg($file->getRealPath()),
            'png' => imagecreatefrompng($file->getRealPath()),
            'gif' => imagecreatefromgif($file->getRealPath()),
            'webp' => imagecreatefromwebp($file->getRealPath()),
            default => throw new \InvalidArgumentException('Unsupported image type: '.$file->getClientOriginalExtension()),
        };

        $filename = uniqid('laptop_', true).'.webp';
        $relativePath = $directory.'/'.$filename;
        $fullPath = Storage::disk('public')->path($relativePath);

        $dir = dirname($fullPath);
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        imagewebp($sourceImage, $fullPath, $quality);
        imagedestroy($sourceImage);

        return $relativePath;
    }
}
