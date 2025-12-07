<?php

namespace App\Services;

use App\Repositories\Interfaces\TaskRepositoryInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\Task;

class TaskService
{
    protected $taskRepository;

    public function __construct(TaskRepositoryInterface $taskRepository)
    {
        $this->taskRepository = $taskRepository;
    }

    public function getIncompleteTasks(int $limit = 5)
    {
        return $this->taskRepository->getIncompleteTasks($limit);
    }

    public function createTask(array $data): Task
    {
        $data['is_completed'] = false;
        return $this->taskRepository->create($data);
    }

    public function completeTask(int $id): Task
    {
        $task = $this->taskRepository->find($id);
        
        if (!$task) {
            throw new ModelNotFoundException("Task with ID {$id} not found");
        }
        
        $this->taskRepository->update($id, ['is_completed' => true]);
        return $task;
    }

    public function findTask(int $id): ?Task
    {
        return $this->taskRepository->find($id);
    }
}