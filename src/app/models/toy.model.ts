export interface AgeGroup {
  ageGorupId: number;
  name: string;
  description: string;
}

export interface ToyType {
  typeId: number;
  name: string;
  description: string;
}

export interface Toy {
  toyId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  permalink: string;
  targetGroup: 'svi' | 'dečak' | 'devojčica';
  productionDate: string;
  ageGroup: AgeGroup;
  type: ToyType;
  rating?: number;
}
