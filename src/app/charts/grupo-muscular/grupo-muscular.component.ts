import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { right } from '@popperjs/core';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { Toast } from 'src/app/helpers/toast';
import { MuscleGroupByDate } from 'src/app/models/exercise-done.model';
import { AuthService } from 'src/app/services/auth.service';
import { ExerciseDoneService } from 'src/app/services/exercise-done.service';

@Component({
  selector: 'app-grupo-muscular',
  templateUrl: './grupo-muscular.component.html',
  styleUrls: ['./grupo-muscular.component.css']
})
export class GrupoMuscularComponent implements OnInit {
  public muscleGroupList: MuscleGroupByDate[] = []
  public muscle_groups: string[] = []
  public counts: number[] = []
  public weeks_of_month: string[] = []

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Volume de exercícios por grupo muscular semanal',
        borderColor: 'black',
      }
    ]
  };

  public lineChartLegend = true;

  constructor(private authService: AuthService, private exerciseDoneService: ExerciseDoneService) {}

  ngOnInit() {
    this.loadMuscleGroupByDate();
  }

  private loadMuscleGroupByDate() {
    this.exerciseDoneService.listMuscleGroupByDate(this.authService.userId).subscribe({
      next: (response: MuscleGroupByDate[]) => {
        this.muscleGroupList = response;

        this.counts = response.map(item => item.count);
        this.muscle_groups = response.map(item => item.muscle_group);
        this.weeks_of_month = response.map(item => item.week_of_month);

        this.updateChartData();
      },
      error: (error: HttpErrorResponse) => {
        switch (error.error.detail) {
          default:
            this.muscleGroupList = [];
            Toast.fire({
              icon: 'question',
              title: 'Sem dados para o gráfico de grupo muscular por data.'
            });
            break;
        }
      }
    });
  }

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true
      }
    },
    plugins: {
      legend: {
        position: right
      }
    }
  };


  private updateChartData() {
    const weeks = [...new Set(this.muscleGroupList.map(item => item.week_of_month))];
    const muscleGroups = [...new Set(this.muscleGroupList.map(item => item.muscle_group))];

    const datasets = muscleGroups.map(muscleGroup => {
      const data = weeks.map(week => {
        const entry = this.muscleGroupList.find(item => item.muscle_group === muscleGroup && item.week_of_month === week);
        return entry ? entry.count : 0;
      });

      return {
        label: muscleGroup,
        data: data,
      };
    });

    this.barChartData = {
      labels: weeks,
      datasets: datasets
    };
  }


}
