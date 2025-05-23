import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  template: `
    <app-host-dashboard *abpPermission="'StudyZone.Dashboard.Host'"></app-host-dashboard>
    <app-tenant-dashboard *abpPermission="'StudyZone.Dashboard.Tenant'"></app-tenant-dashboard>
  `,
})
export class DashboardComponent {}
