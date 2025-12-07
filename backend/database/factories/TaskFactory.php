<?php

namespace Database\Factories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    protected $model = Task::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->optional()->paragraph(),
            'is_completed' => false,
        ];
    }

    public function completed(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'is_completed' => true,
            ];
        });
    }

    public function incomplete(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'is_completed' => false,
            ];
        });
    }
}
