<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_has_fillable_attributes()
    {
        $task = new Task();
        
        $this->assertEquals([
            'title',
            'description',
            'is_completed'
        ], $task->getFillable());
    }

    /** @test */
    public function it_casts_is_completed_to_boolean()
    {
        $task = new Task();
        
        $this->assertTrue($task->hasCast('is_completed', 'boolean'));
    }

    /** @test */
    public function it_can_create_a_task()
    {
        $task = Task::create([
            'title' => 'Test Task',
            'description' => 'Test Description',
            'is_completed' => false
        ]);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Test Task',
            'is_completed' => 0
        ]);
    }

    /** @test */
    public function it_has_default_is_completed_false()
    {
        // Create with only title
        $task = Task::create([
            'title' => 'Test Task'
        ]);
        
        // Refresh from database to get default values
        $task->refresh();

        $this->assertFalse($task->is_completed);
        $this->assertEquals(0, $task->getAttributes()['is_completed']);
    }
}