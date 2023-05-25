import { Component, OnInit, OnDestroy, ElementRef, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements OnInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  pageTitle = 'Employee Edit';
  errorMessage!: string;
  employeeForm!: FormGroup;
  tranMode!: string;
  employee!: Employee;
  private sub!: Subscription;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService) {

    this.validationMessages = {
      name: {
        required: 'Employee name is required.',
        minlength: 'Employee name must be at least three characters.',
        maxlength: 'Employee name cannot exceed 50 characters.'
      },
      cityname: {
        required: 'Employee city name is required.',
      }
    };
  }

  ngOnInit() {
    this.tranMode = "new";
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
      ]],
      address: '',
      cityname: ['', [Validators.required]],
      company: '',
      designation: '',
    });

    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = params.get('id');
        const cityname = params.get('cityname');
        if (id == '0') {
          const employee: Employee = { id: "0", name: "", address: "", company: "", designation: "", cityname: "" };
          this.displayEmployee(employee);
        }
        else {
          this.getEmployee(id);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getEmployee(id: string | null): void {
    this.employeeService.getEmployee(id)
      .subscribe({
        next: (employee: Employee) => this.displayEmployee(employee),
        error: (err) => this.errorMessage = <any>err,
        complete: () => console.info('Get employee in employee edit')
      });
  }

  displayEmployee(employee: Employee): void {
    if (this.employeeForm) {
      this.employeeForm.reset();
    }
    this.employee = employee;
    if (this.employee.id == '0') {
      this.pageTitle = 'Add Employee';
    } else {
      this.pageTitle = `Edit Employee: ${this.employee.name}`;
    }
    this.employeeForm.patchValue({
      name: this.employee.name,
      address: this.employee.address,
      company: this.employee.company,
      designation: this.employee.designation,
      cityname: this.employee.cityname
    });
  }

  deleteEmployee(): void {
    if (this.employee.id == '0') {
      this.onSaveComplete();
    } else {
      if (confirm(`Are you sure want to delete this Employee: ${this.employee.name}?`)) {
        this.employeeService.deleteEmployee(this.employee.id)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: (err) => this.errorMessage = <any>err,
            complete: () => console.info('Delete employee in employee edit')
          });
      }
    }
  }

  saveEmployee(): void {
    if (this.employeeForm.valid) {
      if (this.employeeForm.dirty) {
        const e = { ...this.employee, ...this.employeeForm.value };
        if (e.id === '0') {
          this.employeeService.createEmployee(e)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: (err) => this.errorMessage = <any>err,
              complete: () => console.info('Create employee in employee edit')
            });
        } else {
          this.employeeService.updateEmployee(e)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: (err) => this.errorMessage = <any>err,
              complete: () => console.info('Update employee in employee edit')
            });
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    this.employeeForm.reset();
    this.router.navigate(['/employees']);
  }
}