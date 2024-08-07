import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Toast } from 'src/app/helpers/toast';
import { GetFitnessTest } from 'src/app/models/fitness-test.model';
import { AuthService } from 'src/app/services/auth.service';
import { FitnessTestService } from 'src/app/services/fitness-test.service';

@Component({
  selector: 'app-progresso-peso',
  templateUrl: './progresso-peso.component.html',
  styleUrls: ['./progresso-peso.component.css'],
})
export class ProgressoPesoComponent implements OnInit {
  public fitnessTestList: GetFitnessTest[] = []
  public dates: string[] = []
  public weights: number[] = []
  public body_fats: number[] = []

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Peso corporal (kg)',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgb(159, 204, 46, .4)'
      },
	  {
        data: [],
        label: 'Gordura corporal (%)',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(204, 117, 46,0.3)'
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };

  public lineChartLegend = true;

  constructor(private authService: AuthService, private fitnessTestService: FitnessTestService) {}

  ngOnInit() {
    this.loadFitnessTests();
  }

  private loadFitnessTests() {
    this.fitnessTestService.list(this.authService.userId).subscribe({
      next: (response: GetFitnessTest[]) => {
        this.fitnessTestList = response;

        this.dates = response.map(item => item.date);
        this.weights = response.map(item => item.weight);
        this.body_fats = response.map(item => item.body_fat);

        this.updateChartData();
      },
      error: (error: HttpErrorResponse) => {
        switch (error.error.detail) {
          default:
            this.fitnessTestList = [];
            Toast.fire({
              icon: 'question',
              title: 'Sem dados para o gráfico de evolução de peso.'
            });
            break;
        }
      }
    });
  }

  private updateChartData() {
    this.lineChartData = {
      labels: this.dates,
      datasets: [
        {
          data: this.body_fats,
          label: 'Gordura corporal (%)',
          fill: true,
          tension: 0.5,
          borderColor: 'rgb(0, 0, 0, 0)',
          backgroundColor: 'rgba(204, 117, 46, .9)',
        },
        {
          data: this.weights,
          label: 'Peso corporal (kg)',
          fill: true,
          tension: 0.5,
          borderColor: 'rgb(225, 49, 96, 0)',
          backgroundColor: 'rgb(159, 204, 46, .4)',
        },
      ]
    };
  }
}
