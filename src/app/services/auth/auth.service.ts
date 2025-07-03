import { Injectable, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth'
import { UserProfile } from '../../models/user.model';
import { Firestore, doc, docData, collection, collectionData } from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firestore = inject(Firestore);

  user$ = authState(inject(Auth));

  userProfile$: Observable<UserProfile | null> = this.user$.pipe(
    switchMap(user => {
      if (!user) return of(null);
      const userRef = doc(this.firestore, `users/${user.uid}`);
      return docData(userRef) as Observable<UserProfile>;
    })
  );

  getAllUsers(): Observable<UserProfile[]> {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, { idField: 'uid' }) as Observable<UserProfile[]>;
  }
}
