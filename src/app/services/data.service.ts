import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  private firestore = inject(Firestore);

  collectionPath(userId: string, name: string) {
    return `users/${userId}/${name}`;
  }

  getCollection<T>(userId: string, name: string): Observable<T[]> {
    const col = collection(this.firestore, this.collectionPath(userId, name));
    return collectionData(col, { idField: 'id' }) as Observable<T[]>;
  }

  addDocument(userId: string, name: string, data: any) {
    const col = collection(this.firestore, this.collectionPath(userId, name));
    return addDoc(col, data);
  }

  updateDocument(userId: string, name: string, id: string, data: any) {
    const d = doc(this.firestore, `${this.collectionPath(userId, name)}/${id}`);
    return updateDoc(d, data);
  }

  deleteDocument(userId: string, name: string, id: string) {
    const d = doc(this.firestore, `${this.collectionPath(userId, name)}/${id}`);
    return deleteDoc(d);
  }
}
