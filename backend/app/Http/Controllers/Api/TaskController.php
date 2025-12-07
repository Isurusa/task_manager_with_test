<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateTaskRequest;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TaskController extends Controller
{
    protected $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function index(): JsonResponse
    {
        $tasks = $this->taskService->getIncompleteTasks(5);
        return response()->json($tasks);
    }

    public function store(CreateTaskRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $task = $this->taskService->createTask($validated);

            return response()->json($task, 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create task. Please try again.',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function complete($id): JsonResponse
    {
        try {
            $task = $this->taskService->completeTask($id);

            return response()->json([
                'success' => true,
                'message' => 'Task marked as completed successfully.',
                'data' => $task
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update task.',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
