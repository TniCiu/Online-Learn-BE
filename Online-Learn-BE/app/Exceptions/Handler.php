<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Auth\AuthenticationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class Handler extends ExceptionHandler
{
    // Danh sách các lỗi mà bạn muốn bỏ qua
    protected $dontReport = [
        AuthenticationException::class,
        AuthorizationException::class,
        ModelNotFoundException::class,
    ];

    // Các phương thức render để xử lý các loại lỗi
    public function render($request, Throwable $exception)
    {
        // Kiểm tra lỗi xác thực (không có token hoặc token sai)
        if ($exception instanceof AuthenticationException) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Kiểm tra lỗi quyền truy cập (403) - Không có quyền thực hiện hành động
        if ($exception instanceof AuthorizationException) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        // Kiểm tra lỗi HTTP khác (404, 500, v.v.)
        if ($exception instanceof HttpException) {
            return response()->json([
                'error' => $exception->getMessage(),
                'status' => $exception->getStatusCode()
            ], $exception->getStatusCode());
        }

        // Kiểm tra lỗi khi không tìm thấy dữ liệu (ví dụ: tìm kiếm người dùng không tồn tại)
        if ($exception instanceof ModelNotFoundException) {
            return response()->json(['error' => 'Resource not found'], 404);
        }

        // Mặc định: xử lý các lỗi khác không nằm trong các trường hợp trên
        return parent::render($request, $exception);
    }

    // Bạn có thể tùy chỉnh thêm các phương thức khác nếu cần
}
