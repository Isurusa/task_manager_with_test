<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\TaskService;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Models\Task;
use Illuminate\Support\Collection;
use Mockery;

class TaskServiceTest extends TestCase
{
    private $taskRepositoryMock;
    private $taskService;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->taskRepositoryMock = Mockery::mock(TaskRepositoryInterface::class);
        $this->taskService = new TaskService($this->taskRepositoryMock);
    }

    /** @test */
    public function it_can_get_incomplete_tasks()
    {
        $expectedTasks = new Collection([
            new Task(['id' => 1, 'title' => 'Task 1', 'is_completed' => false]),
            new Task(['id' => 2, 'title' => 'Task 2', 'is_completed' => false]),
        ]);
        
        $this->taskRepositoryMock
            ->shouldReceive('getIncompleteTasks')
            ->with(5)
            ->once()
            ->andReturn($expectedTasks);

        $tasks = $this->taskService->getIncompleteTasks(5);

        $this->assertCount(2, $tasks);
        $this->assertInstanceOf(Collection::class, $tasks);
    }

    /** @test */
    public function it_can_create_a_task()
    {
        $taskData = [
            'title' => 'Test Task',
            'description' => 'Test Description'
        ];

        // What the service will send to repository
        $expectedData = [
            'title' => 'Test Task',
            'description' => 'Test Description',
            'is_completed' => false // Added by service
        ];

        $task = new Task($expectedData);
        $task->id = 1;
        
        $this->taskRepositoryMock
            ->shouldReceive('create')
            ->with($expectedData) // Expect is_completed to be included
            ->once()
            ->andReturn($task);

        $result = $this->taskService->createTask($taskData);

        $this->assertInstanceOf(Task::class, $result);
        $this->assertEquals('Test Task', $result->title);
        $this->assertEquals(1, $result->id);
        $this->assertFalse($result->is_completed);
    }

    /** @test */
    public function it_can_complete_a_task()
    {
        $task = new Task(['title' => 'Test Task']);
        $task->id = 1;
        
        $this->taskRepositoryMock
            ->shouldReceive('find')
            ->with(1)
            ->once()
            ->andReturn($task);

        $this->taskRepositoryMock
            ->shouldReceive('update')
            ->with(1, ['is_completed' => true])
            ->once()
            ->andReturn(true);

        $result = $this->taskService->completeTask(1);

        $this->assertInstanceOf(Task::class, $result);
        $this->assertEquals(1, $result->id);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}