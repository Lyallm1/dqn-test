export class TakenSpots {
  private spots: string[] = [];

  add(...spot: string[]) {
    this.spots.push(...spot);
  }

  all() {
    return this.spots;
  }
}
