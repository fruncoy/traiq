export interface BidPackage {
  id: string;
  name: string;
  bids: number;
  price: number;
  popular?: boolean;
}

export const bidPackages: BidPackage[] = [
  {
    id: "1",
    name: "Starter",
    bids: 1,
    price: 60
  },
  {
    id: "2",
    name: "Basic",
    bids: 3,
    price: 100,
    popular: true
  },
  {
    id: "3",
    name: "Standard",
    bids: 7,
    price: 200
  },
  {
    id: "4",
    name: "Premium",
    bids: 10,
    price: 400
  }
];