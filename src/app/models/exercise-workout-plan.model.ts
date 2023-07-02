export interface ExerciseWorkoutPlan {
	exercise_id: number,
  workout_plan_id: number,
  sets: number,
  reps: number,
  combination: number,
  id: number,
  exercise_name: string,
  workout_id: number;
  workout_max_weight: number;
  workout_reps: number;
}

export interface ExerciseWorkoutPlanEdited {
  exercise_id: number,
  workout_plan_id: number,
  sets: number,
  reps: number,
  combination: number,
  id: number,
  exercise_name: string,
  workout_list: {
    workout_id: number;
    workout_max_weight: number;
    workout_reps: number;
  }[]
}
