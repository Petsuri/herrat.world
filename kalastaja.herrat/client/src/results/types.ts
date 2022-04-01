export class Competitor {
  constructor(private readonly result: CompetitionResult) {}

  public title(): string {
    return `#${this.result.place} ${this.result.name}`;
  }
  public weight(): Kilograms {
    return this.result.fishWeight;
  }
  public location(): string {
    return this.result.location;
  }
  public isFirstPlace(): boolean {
    return this.result.place === 1;
  }
  public color(): PlaceColors {
    const colors = new Map<Place, PlaceColors>();
    colors.set(1, Gold);
    colors.set(2, Silver);
    colors.set(3, Bronze);

    return colors.get(this.result.place)!;
  }
}

export interface CompetitionResult {
  readonly name: string;
  readonly fishWeight: Kilograms;
  readonly location: string;
  readonly place: Place;
}

export type Kilograms = number;
export type Place = 1 | 2 | 3;

export const Gold = '#FFD700';
export const Silver = '#C0C0C0';
export const Bronze = '#CD7F32';
export type PlaceColors = typeof Gold | typeof Silver | typeof Bronze;
