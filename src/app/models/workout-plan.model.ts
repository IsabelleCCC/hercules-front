export interface WorkoutPlan {
	name: number
	start_date: string
	end_date: string
	user_id: number
	id: number
  exercises_workout_plan: [
    {
      exercise_id: number,
      sets: number,
      reps: number,
      combination: number | null
    }
  ]
}

export interface WorkoutPlanWithExerciseWorkoutPlan {
	name: number
	start_date: string
	end_date: string
	user_id: number
	id: number
  exercises_workout_plan: [
    {
      exercise_id: number,
      sets: number,
      reps: number,
      combination: number | null
    }
  ]
}

export interface InsertWorkoutPlan {
	name: number
	start_date: string
	end_date: string
	user_id: number
}

export interface DeleteWorkoutPlan {
	id: number
}
