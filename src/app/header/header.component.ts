import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {DataStorageService} from "../shared/data-storage-service";
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy{
  private userSub: Subscription;
  isAuthanticated = false;
  constructor(private dataStorageService: DataStorageService,
              private autServive: AuthService) {
  }

  ngOnInit() {
    this.userSub = this.autServive.user.subscribe(

        user => {
          this.isAuthanticated = !user ? false : true;
        }
    );
  }

  onSaveData(){
    this.dataStorageService.storeRecipes();
  }

  onFetchData(){
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout(){
    this.autServive.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
