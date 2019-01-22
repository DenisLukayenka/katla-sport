import { Component, OnInit } from '@angular/core';
import { HiveSection } from '../models/hive-section';
import { HiveListItem } from '../models/hive-list-item';
import { ActivatedRoute, Router } from '@angular/router';
import { HiveService } from '../services/hive.service';
import { HiveSectionService } from '../services/hive-section.service';

@Component({
  selector: 'app-hive-section-form',
  templateUrl: './hive-section-form.component.html',
  styleUrls: ['./hive-section-form.component.css']
})

export class HiveSectionFormComponent implements OnInit {

  hiveSection = new HiveSection(0, "Name of section", "CVE11", false, -1, "");
  existed = false;
  hiveId: number;
  hives: HiveListItem[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hiveService: HiveService,
    private hiveSectionService: HiveSectionService,
  ) { }

  ngOnInit() {
    this.hiveService.getHives().subscribe(c => this.hives = c);
    this.route.params.subscribe(p => {

    this.hiveId = p['storeHiveId'];

    if (p['id'] === undefined) {
      if(this.hiveId != undefined) {
        this.hiveSection.storeHiveId = +this.hiveId;
      }
      return;
    }

    this.hiveSectionService.getHiveSection(p['id']).subscribe(c => this.hiveSection = c);
    this.existed = true;
    });
  }

  navigateTo() {
    if (this.hiveId === undefined) {
      this.router.navigate(['/sections']);
    } else {
      this.router.navigate([`/hive/${this.hiveId}/sections`]);
    }
  }

  onCancel() {
    this.navigateTo();
  }

  onSubmit() {
    if (this.existed) {
      this.hiveSectionService.updateHiveSection(this.hiveSection).subscribe(p=> this.navigateTo());
    } else {
      this.hiveSectionService.addHiveSection(this.hiveSection).subscribe(p=> this.navigateTo());
    }
  }

  onDelete() {
    this.hiveSectionService.setHiveSectionStatus(this.hiveSection.id, true).subscribe(h => this.hiveSection.isDeleted = true);
  }

  onUndelete() {
    this.hiveSectionService.setHiveSectionStatus(this.hiveSection.id, false).subscribe(h => this.hiveSection.isDeleted = false);
  }

  onPurge() {
    this.hiveSectionService.deleteHiveSection(this.hiveSection.id).subscribe(p => this.navigateTo());
  }
}
