export interface WorkoutDoneWithName {
  datetime: string,
  duration: number,
  workout_plan_id: number,
  id: number,
  workout_name: string
}

export interface WorkoutDonePagination {
  count: number,
  workouts_done: [
    {
      datetime: string,
      duration: number,
      workout_plan_id: number,
      id: number,
      workout_name: string
    }
  ]
}

export interface WorkoutDoneModel {
    datetime: Date,
    duration: number,
    workout_plan_id: number,
    exercises_done: [
      {
        reps: number,
        max_weight: number,
        exercise_plan_id: number
      }
    ]
}
