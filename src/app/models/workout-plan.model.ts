import { ExercisePlan } from "./exercise-plan.model"

export interface WorkoutPlan {
	name: string
	start_date: string
	end_date: string
	user_id: number
	id: number
  exercise_plans: [ExercisePlan]
}

export interface InsertWorkoutPlan {
	name: string
	start_date: string
	end_date: string
	user_id: number
  exercise_plans: [
    {
      exercise_id: number,
      sets: number,
      reps: number,
      combination: number | null
    }
  ]
}

export interface DeleteWorkoutPlan {
	id: number
}
