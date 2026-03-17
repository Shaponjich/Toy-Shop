import { Toy } from './toy.model';

export type ReservationStatus = 'rezervisano' | 'pristiglo' | 'otkazano';

export interface CartItem {
  id: number;
  toy: Toy;
  status: ReservationStatus;
  rating?: number;
}
