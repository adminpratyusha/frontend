import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Employee } from './employee';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
  //+ 'api/employee'
  private employeesUrl = environment.baseUrl;

  

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeesUrl,)
      .pipe(
        catchError(this.handleError)
      );
  }

  getEmployee(id: string | null): Observable<Employee> {
    if (id === '') {
      return of(this.initializeEmployee());
    }
    const url = `${this.employeesUrl}/${id}`;
    return this.http.get<Employee>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  createEmployee(employee: Employee): Observable<Employee> {
    employee.id = '';
    return this.http.post<Employee>(this.employeesUrl, employee)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteEmployee(id: string): Observable<{}> {
    const url = `${this.employeesUrl}/${id}`;
    return this.http.delete<Employee>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    const url = `${this.employeesUrl}/${employee.id}`;
    return this.http.put<Employee>(url, employee)
      .pipe(
        map(() => employee),
        catchError(this.handleError)
      );
  }

  private handleError(err: any) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }

  private initializeEmployee(): Employee {
    return {
      id: "",
      name: "",
      address: "",
      company: "",
      designation: "",
      cityname: ""
    };
  }
}